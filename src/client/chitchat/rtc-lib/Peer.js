const twilioIceServers = [
    { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
];
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
function logError(error) {
    console.log("logError", error);
}
export const CANDIDATE = "candidate";
export const PEER_STREAM_ADDED = "peerStreamAdded";
export const PEER_STREAM_REMOVED = "peerStreamRemoved";
export const CONNECTIVITY_ERROR = "connectivityError";
export const MUTE = "mute";
export const UNMUTE = "unmute";
export const ANSWER = "answer";
export const OFFER = "offer";
export class Peer {
    constructor(parents, options) {
        this.id = parents.socket_id;
        this.pcPeers = parents.pcPeers;
        this.parentsEmitter = parents.emitter;
        this.send_event = parents.sendHandler;
        this.pc = new RTCPeerConnection(configuration);
        let self = this;
        const isOffer = options.offer;
        this.pc.onicecandidate = function (event) {
            console.log('onicecandidate', event.candidate);
            if (event.candidate) {
                self.send_event(CANDIDATE, event.candidate, { to: self.id });
            }
        };
        this.pc.onnegotiationneeded = function () {
            console.log('onnegotiationneeded');
            if (isOffer) {
                self.createOffer();
            }
        };
        this.pc.oniceconnectionstatechange = function (event) {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            if (event.target.iceConnectionState === 'completed') {
                setTimeout(() => {
                    self.getStats();
                }, 1000);
            }
            if (event.target.iceConnectionState === 'connected') {
                self.createDataChannel();
            }
        };
        this.pc.onsignalingstatechange = function (event) {
            console.log('onsignalingstatechange', event.target.signalingState);
        };
        this.pc.onaddstream = function (event) {
            console.log('onaddstream', event.stream);
            self.parentsEmitter.emit(PEER_STREAM_ADDED, event.stream);
        };
        this.pc.onremovestream = function (event) {
            console.log('onremovestream', event.stream);
            self.parentsEmitter.emit(PEER_STREAM_REMOVED, event.stream);
        };
        this.pc.addStream(parents.stream);
    }
    getStats() {
        const peer = this.pcPeers[Object.keys(this.pcPeers)[0]];
        const pc = peer.pc;
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            console.log('track', track);
            pc.getStats(track, function (report) {
                console.log('getStats report', report);
            }, logError);
        }
    }
    createOffer() {
        let self = this;
        this.pc.createOffer(function (desc) {
            console.log('createOffer', desc);
            self.pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', self.pc.localDescription);
                self.send_event(OFFER, self.pc.localDescription, { to: self.id });
            }, logError);
        }, logError);
    }
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
        };
        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
        };
        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };
        this.pc.textDataChannel = dataChannel;
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
            console.log('exchange sdp', message);
            self.pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                if (self.pc.remoteDescription.type == OFFER)
                    self.pc.createAnswer(function (desc) {
                        console.log('createAnswer', desc);
                        self.pc.setLocalDescription(desc, function () {
                            console.log('setLocalDescription', self.pc.localDescription);
                            self.send_event(ANSWER, self.pc.localDescription, { to: message.from });
                        }, logError);
                    }, logError);
            }, logError);
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
            var mLines = this.pc.pc.transceivers || [];
            mLines.forEach(function (mLine) {
                if (mLine.iceTransport) {
                    mLine.iceTransport.addRemoteCandidate({});
                }
            });
        }
    }
    ;
}
