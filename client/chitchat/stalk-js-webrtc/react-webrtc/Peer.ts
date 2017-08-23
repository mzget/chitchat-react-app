import EventEmitter = require("events");
import adapter from 'webrtc-adapter';

import { AbstractPeerConnection } from "../IWebRTC";
import { getImage } from '../libs/VideoToBlurImage';
import { createStreamByText } from '..//libs/StreamHelper';

// const twilioIceServers = [
//     { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
// ];
// configuration.iceServers = twilioIceServers;
const configuration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] };

export interface PeerConstructor {
    peer_id; stream; pcPeers; emitter; sendHandler; offer; debug;
}
export class Peer implements AbstractPeerConnection.IPCHandler {
    debug: boolean;
    type: string;
    parentsEmitter: EventEmitter;
    id: string;
    pc: RTCPeerConnection;
    enableDataChannels: boolean = true;
    receiveChannel;
    channels = {};
    pcPeers;
    browserPrefix: string;
    nick;
    stream: MediaStream;

    send_event: (messageType: string, payload?: any, optional?: { to: string }) => void;
    logError = (error) => {
        console.log(error);
    };

    /**
     * reture PeerConnection
     * @param socket 
     * @param stream 
     * @param options 
     */
    constructor(config: PeerConstructor) {
        if (!config.stream) {
            throw new Error("Missing stream!!!");
        }

        this.debug = config.debug;
        this.id = config.peer_id;
        this.pcPeers = config.pcPeers;
        this.parentsEmitter = config.emitter;
        this.send_event = config.sendHandler;
        this.pc = new RTCPeerConnection(configuration);
        let self = this;
        const isOffer = config.offer;

        this.pc.onicecandidate = function (event) {
            if (event.candidate) {
                // socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
                self.send_event(AbstractPeerConnection.CANDIDATE, event.candidate, { to: self.id });
            }
        };

        this.pc.onnegotiationneeded = function () {
            if (isOffer) {
                self.createOffer();
            }
        }

        this.pc.oniceconnectionstatechange = function (event) {
            if (self.debug)
                console.log('oniceconnectionstatechange', event.target.iceConnectionState);

            if (event.target.iceConnectionState === 'completed') {
                // setTimeout(() => {
                //     self.getStats();
                // }, 1000);
            }
            if (event.target.iceConnectionState === 'connected') {
                self.createDataChannel("message");
                self.pc.ondatachannel = self.receiveChannelCallback.bind(self);
            }
            else if (event.target.iceConnectionState == "failed") {
                self.parentsEmitter.emit(AbstractPeerConnection.ON_ICE_CONNECTION_FAILED, self);
                self.send_event(AbstractPeerConnection.CONNECTIVITY_ERROR, null, { to: self.id });
            }
        };
        this.pc.onsignalingstatechange = function (event) {
            if (self.debug)
                console.log('onsignalingstatechange', event.target.signalingState);
        };
        this.pc.onaddstream = function (peer) {
            if (self.debug)
                console.log('onaddstream');

            self.parentsEmitter.emit(AbstractPeerConnection.PEER_STREAM_ADDED, peer);
        };
        this.pc.onremovestream = function (peer) {
            if (self.debug)
                console.log('onremovestream');

            self.parentsEmitter.emit(AbstractPeerConnection.PEER_STREAM_REMOVED, peer.stream);
        };

        this.pc.addStream(config.stream);
    }

    removeStream(stream: MediaStream) {
        this.pc.removeStream(stream);
    }

    addStream(stream: MediaStream) {
        this.pc.addStream(stream);
    }

    getStats() {
        let self = this;
        const peer = this.pcPeers[Object.keys(this.pcPeers)[0]];
        const pc = peer.pc as RTCPeerConnection;

        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];

            pc.getStats(track, (report) => {
                console.log('getStats report', report);
            }, self.logError);
        }
    }

    onSetSessionDescriptionError(error) {
        console.warn('Failed to set session description: ' + error.toString());
    }
    onCreateSessionDescriptionError(error) {
        console.warn('Failed to create session description: ' + error.toString());
    }

    createOffer() {
        let self = this;

        this.pc.createOffer(function (desc) {
            if (self.debug)
                console.log('createOffer', desc);

            self.pc.setLocalDescription(desc, function () {
                if (self.debug)
                    console.log('setLocalDescription', self.pc.localDescription);

                self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: self.id });
            }, self.onSetSessionDescriptionError);
        },
            self.onCreateSessionDescriptionError);
    }
    createAnswer(message) {
        let self = this;
        self.pc.createAnswer(function (desc) {
            if (self.debug)
                console.log('createAnswer', desc);

            self.pc.setLocalDescription(desc, function () {
                if (self.debug)
                    console.log('setLocalDescription', self.pc.localDescription);

                self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: message.from });
            }, self.onSetSessionDescriptionError);
        }, self.onCreateSessionDescriptionError);
    }

    handleMessage(message) {
        let self = this;
        if (self.debug)
            console.log('handleMessage', message.type, message);

        if (message.prefix)
            this.browserPrefix = message.prefix;
        if (message.type === AbstractPeerConnection.OFFER) {
            if (!this.nick)
                this.nick = message.payload.nick;
            delete message.payload.nick;

            self.pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                if (self.debug)
                    console.log("setRemoteDescription complete");

                if (self.pc.remoteDescription.type == AbstractPeerConnection.OFFER) {
                    self.createAnswer(message);
                }
            }, self.onSetSessionDescriptionError);
        }
        else if (message.type === AbstractPeerConnection.ANSWER) {
            // @ No need this.
        }
        else if (message.type === AbstractPeerConnection.CANDIDATE) {
            if (self.debug)
                console.log('exchange candidate');

            function onAddIceCandidateSuccess() {
                if (self.debug)
                    console.log('addIceCandidate success');
            }

            function onAddIceCandidateError(error) {
                console.warn('failed to add ICE Candidate: ' + error.toString());
            }
            self.pc.addIceCandidate(new RTCIceCandidate(message.candidate), onAddIceCandidateSuccess, onAddIceCandidateError);
        }
        else if (message.type === AbstractPeerConnection.CONNECTIVITY_ERROR) {
            this.parentsEmitter.emit(AbstractPeerConnection.CONNECTIVITY_ERROR, self);
        }
        else if (message.type === AbstractPeerConnection.MUTE) {
            this.parentsEmitter.emit(AbstractPeerConnection.MUTE, { id: message.from, name: message.payload.name });
        }
        else if (message.type === AbstractPeerConnection.UNMUTE) {
            this.parentsEmitter.emit(AbstractPeerConnection.UNMUTE, { id: message.from, name: message.payload.name });
        }
        else if (message.type === 'endOfCandidates') {
            // Edge requires an end-of-candidates. Since only Edge will have mLines or tracks on the
            // shim this will only be called in Edge.
            var mLines = this.pc.pc.transceivers || [];
            mLines.forEach(function (mLine) {
                if (mLine.iceTransport) {
                    mLine.iceTransport.addRemoteCandidate({});
                }
            });
        }
    };

    // send via data channel
    // returns true when message was sent and false if channel is not open
    sendDirectly(channel, messageType, payload) {
        let message = {
            type: messageType,
            payload: payload
        };
        console.log('sending via datachannel', channel, messageType, message);

        let dc = this.getDataChannel(channel);
        if (dc.readyState != 'open')
            return false;

        dc.send(JSON.stringify(message));
        return true;
    };

    getDataChannel(name) {
        // if (!webrtcSupport.supportDataChannel)
        //     return this.emit('error', new Error('createDataChannel not supported'));
        let channel = this.channels[name];
        if (channel)
            return channel;
        // if we don't have one by this label, create it
        return this.createDataChannel(name);
    }

    createDataChannel(name) {
        let self = this;
        let dataConstraint = null;

        if (this.channels[name]) {
            return;
        }

        let channel = this.channels[name] = this.pc.createDataChannel(name, dataConstraint);

        channel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };

        channel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
        };

        channel.onopen = function () {
            console.log('dataChannel.onopen');
        };

        channel.onclose = function () {
            console.log("dataChannel.onclose");
        };

        return channel;
    }

    receiveChannelCallback(event) {
        console.log('Receive Channel', event.channel.label);
        this.receiveChannel = event.channel;
        this.receiveChannel.onmessage = this.onReceiveMessageCallback.bind(this);
        this.receiveChannel.onopen = this.onReceiveChannelStateChange.bind(this);
        this.receiveChannel.onclose = this.onReceiveChannelStateChange.bind(this);
    }

    onReceiveChannelStateChange() {
        let readyState = this.receiveChannel.readyState;
        console.log('Receive channel state is: ' + readyState);
    }

    onReceiveMessageCallback(event) {
        console.log('Receive Message', event.data);
        const data = JSON.parse(event.data);
        let remoteVideoElement: HTMLVideoElement = document.getElementById('remoteVideos');
        let remoteAudioElement: HTMLVideoElement = document.getElementById('remoteAudio');
        if (data.type === AbstractPeerConnection.UNPAUSE) {
            remoteAudioElement.src = '';
            remoteVideoElement.srcObject = null;
            remoteVideoElement.src = URL.createObjectURL(this.pc.getRemoteStreams()[0]);
        }
        else if (data.type === AbstractPeerConnection.PAUSE) {
            remoteAudioElement.src = URL.createObjectURL(this.pc.getRemoteStreams()[0]);
            getImage(remoteVideoElement).then((res: MediaStream) => {
                remoteVideoElement.srcObject = res;
            });
        }
        else if (data.type === AbstractPeerConnection.DUMMY_VIDEO) {
            let canvasStream = createStreamByText("NO CAMERA");
            if (!!canvasStream) remoteVideoElement.src = URL.createObjectURL(canvasStream);
        }
    }
}