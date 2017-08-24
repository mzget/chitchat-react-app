import { Platform } from 'react-native';
import * as events from 'events';
import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

import { AbstractPeerConnection } from "../index";

const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

export class Peer implements AbstractPeerConnection.IPC_Handler {
    type: string;
    parentsEmitter: events.EventEmitter;
    id: string;
    pc: RTCPeerConnection;
    receiveChannel;
    channels = {};
    pcPeers;
    browserPrefix;
    nick;
    stream: MediaStream;

    send_event: (messageType: string, payload?: any, optional?: { to: string }) => void;
    logError: (error) => void;

    /**
     * reture PeerConnection
     * @param socket 
     * @param stream 
     * @param options 
     */
    constructor(parents: { peer_id, stream, pcPeers, emitter, sendHandler, offer }) {
        this.id = parents.peer_id;
        this.pcPeers = parents.pcPeers;
        this.parentsEmitter = parents.emitter;
        this.send_event = parents.sendHandler;
        this.pc = new RTCPeerConnection(configuration);
        let self = this;
        const isOffer = parents.offer;

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
                self.send_event(AbstractPeerConnection.CONNECTIVITY_ERROR, null, { to: self.id });
            }
        };
        this.pc.onsignalingstatechange = function (event) {
            console.log('onsignalingstatechange', event.target.signalingState);
        };
        this.pc.onaddstream = function (peer) {
            console.log('onaddstream', peer.stream);
            self.parentsEmitter.emit(AbstractPeerConnection.PEER_STREAM_ADDED, peer);
        };
        this.pc.onremovestream = function (peer) {
            console.log('onremovestream', peer.stream);
            self.parentsEmitter.emit(AbstractPeerConnection.PEER_STREAM_REMOVED, peer.stream);
        };

        this.pc.addStream(parents.stream);
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
        const pc = peer.pc;

        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            pc.getStats(track, function (report) {
                console.log('getStats report', report);
            }, self.logError);
        }
    }

    onSetSessionDescriptionError(error) {
        console.log('Failed to set session description: ' + error.toString());
    }
    onCreateSessionDescriptionError(error) {
        console.log('Failed to create session description: ' + error.toString());
    }

    createOffer() {
        let self = this;

        this.pc.createOffer(function (desc) {
            console.log('createOffer', desc);

            self.pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', self.pc.localDescription);
                // socket.emit('message', { to: socketId, 'sdp': pc.localDescription });
                self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: self.id });
            },
                self.onSetSessionDescriptionError);
        },
            self.onCreateSessionDescriptionError);
    }
    createAnswer(message) {
        let self = this;
        self.pc.createAnswer(function (desc) {
            console.log('createAnswer', desc);

            self.pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', self.pc.localDescription);
                // socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
                self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: message.from });
            }, self.onSetSessionDescriptionError);
        }, self.onCreateSessionDescriptionError);
    }

    handleMessage(message) {
        let self = this;
        console.log('getting', message.type, message);

        if (message.prefix)
            this.browserPrefix = message.prefix;

        if (message.type === AbstractPeerConnection.OFFER) {
            if (!this.nick)
                this.nick = message.payload.nick;
            delete message.payload.nick;

            self.pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                if (self.pc.remoteDescription.type == AbstractPeerConnection.OFFER) {
                    self.createAnswer(message);
                }
            }, self.onSetSessionDescriptionError);
        }
        else if (message.type === 'candidate') {
            console.log('exchange candidate');
            self.pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    };

    createDataChannel() {
        if (this.pc.textDataChannel) {
            return;
        }
        const dataChannel = this.pc.createDataChannel("text");

        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };

        dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
            let message = event.data;

            if (message.type === 'connectivityError') {
                this.parentsEmitter.emit(AbstractPeerConnection.CONNECTIVITY_ERROR, self);
            }
            else if (message.type === 'mute') {
                this.parentsEmitter.emit(AbstractPeerConnection.MUTE, { id: message.from, name: message.payload.name });
            }
            else if (message.type === 'unmute') {
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

        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
        };

        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };

        this.pc.textDataChannel = dataChannel;
    }
}