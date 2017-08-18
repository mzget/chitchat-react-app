const twilioIceServers = [
    { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
];
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
export const CANDIDATE = "candidate";
export const PEER_STREAM_ADDED = "peerStreamAdded";
export const PEER_STREAM_REMOVED = "peerStreamRemoved";
export const CONNECTIVITY_ERROR = "connectivityError";
export const MUTE = "mute";
export const UNMUTE = "unmute";
export const ANSWER = "answer";
export const OFFER = "offer";
export class Peer {
    constructor(parents) {
        this.logError = (error) => {
            console.log(error);
        };
        this.id = parents.peer_id;
        this.pcPeers = parents.pcPeers;
        this.parentsEmitter = parents.emitter;
        this.send_event = parents.sendHandler;
        this.pc = new RTCPeerConnection(configuration);
        let self = this;
        const isOffer = parents.offer;
        this.pc.onicecandidate = function (event) {
            if (event.candidate) {
                self.send_event(CANDIDATE, event.candidate, { to: self.id });
            }
        };
        this.pc.onnegotiationneeded = function () {
            if (isOffer) {
                self.createOffer();
            }
        };
        this.pc.oniceconnectionstatechange = function (event) {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            if (event.target.iceConnectionState === 'completed') {
            }
            if (event.target.iceConnectionState === 'connected') {
                self.createDataChannel();
            }
            else if (event.target.iceConnectionState == "failed") {
                self.parentsEmitter.emit('iceFailed', self);
                self.send_event(CONNECTIVITY_ERROR, null, { to: self.id });
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
        let self = this;
        const peer = this.pcPeers[Object.keys(this.pcPeers)[0]];
        const pc = peer.pc;
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
                self.send_event(OFFER, self.pc.localDescription, { to: self.id });
            }, self.logError);
        }, self.logError);
    }
    createDataChannel() {
        let self = this;
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
            self.pc.setRemoteDescription(new RTCSessionDescription(message.payload), function () {
                if (self.pc.remoteDescription.type == OFFER)
                    self.pc.createAnswer(function (desc) {
                        console.log('createAnswer', desc);
                        self.pc.setLocalDescription(desc, function () {
                            console.log('setLocalDescription', self.pc.localDescription);
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
