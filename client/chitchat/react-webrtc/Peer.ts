import EventEmitter = require("events");
import adapter from 'webrtc-adapter';

// const twilioIceServers = [
//     { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
// ];
// configuration.iceServers = twilioIceServers;
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

export const CANDIDATE = "candidate";
export const PEER_STREAM_ADDED = "peerStreamAdded";
export const PEER_STREAM_REMOVED = "peerStreamRemoved";
export const CONNECTIVITY_ERROR = "connectivityError";
export const MUTE = "mute";
export const UNMUTE = "unmute";

export const ANSWER = "answer";
export const OFFER = "offer";

export class Peer {
    type: string;
    parentsEmitter: EventEmitter;
    id: string;
    pc: RTCPeerConnection;
    enableDataChannels: boolean = true;
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
    constructor(config: { peer_id, stream, pcPeers, emitter, sendHandler, offer }) {
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
                self.send_event(CANDIDATE, event.candidate, { to: self.id });
            }
        };

        this.pc.onnegotiationneeded = function () {
            if (isOffer) {
                self.createOffer();
            }
        }

        this.pc.oniceconnectionstatechange = function (event) {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            if (event.target.iceConnectionState === 'completed') {
                // setTimeout(() => {
                //     self.getStats();
                // }, 1000);
            }
            if (event.target.iceConnectionState === 'connected') {
                self.createDataChannel();
            }
            else if (event.target.iceConnectionState == "failed") {
                // currently, in chrome only the initiator goes to failed
                // so we need to signal this to the peer

                self.parentsEmitter.emit('iceFailed', self);
                self.send_event(CONNECTIVITY_ERROR, null, { to: self.id });
            }
        };
        this.pc.onsignalingstatechange = function (event) {
            console.log('onsignalingstatechange', event.target.signalingState);
        };
        this.pc.onaddstream = function (peer) {
            console.log('onaddstream', peer.stream);

            self.parentsEmitter.emit(PEER_STREAM_ADDED, peer);
        };
        this.pc.onremovestream = function (peer) {
            console.log('onremovestream', peer.stream);
            self.parentsEmitter.emit(PEER_STREAM_REMOVED, peer.stream);
        };

        this.pc.addStream(config.stream);
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

    createOffer() {
        let self = this;

        this.pc.createOffer(function (desc) {
            console.log('createOffer', desc);

            self.pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', self.pc.localDescription);
                // socket.emit('message', { to: socketId, 'sdp': pc.localDescription });
                self.send_event(OFFER, self.pc.localDescription, { to: self.id });
            }, self.logError);
        },
            self.logError);
    }

    handleMessage(message) {
        let self = this;
        console.log('getting', message.type, message);

        if (message.prefix)
            this.browserPrefix = message.prefix;
        if (message.type === OFFER) {
            if (!this.nick)
                this.nick = message.payload.nick;
            delete message.payload.nick;

            self.pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                if (self.pc.remoteDescription.type == OFFER)
                    self.pc.createAnswer(function (desc) {
                        console.log('createAnswer', desc);

                        self.pc.setLocalDescription(desc, function () {
                            console.log('setLocalDescription', self.pc.localDescription);
                            // socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
                            self.send_event(OFFER, self.pc.localDescription, { to: message.from });
                        }, self.logError);
                    }, self.logError);
            }, self.logError);
        }
        else if (message.type === ANSWER) {
            if (!this.nick)
                this.nick = message.payload.nick;
            delete message.payload.nick;
            this.pc.handleAnswer(message.payload);
        }
        else if (message.type === 'candidate') {
            console.log('exchange candidate', message);
            self.pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
        else if (message.type === 'connectivityError') {
            this.parentsEmitter.emit(CONNECTIVITY_ERROR, self);
        }
        else if (message.type === 'mute') {
            this.parentsEmitter.emit(MUTE, { id: message.from, name: message.payload.name });
        }
        else if (message.type === 'unmute') {
            this.parentsEmitter.emit(UNMUTE, { id: message.from, name: message.payload.name });
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
}