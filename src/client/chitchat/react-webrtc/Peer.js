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
    constructor(config) {
        this.enableDataChannels = true;
        this.channels = {};
        this.logError = (error) => {
            console.log(error);
        };
        this.id = config.peer_id;
        this.pcPeers = config.pcPeers;
        this.parentsEmitter = config.emitter;
        this.send_event = config.sendHandler;
        this.pc = new RTCPeerConnection(configuration);
        let self = this;
        const isOffer = config.offer;
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
        this.pc.oniceconnectionstatechange = function (pc, event) {
            console.log('oniceconnectionstatechange', event, pc.iceConnectionState);
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
        const pc = peer.pc;
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            pc.getStats(track, (report) => {
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
                self.send_event(OFFER, self.pc.localDescription, { to: self.id });
            }, self.onSetSessionDescriptionError);
        }, self.onCreateSessionDescriptionError);
    }
    createAnswer(message) {
        let self = this;
        self.pc.createAnswer(function (desc) {
            console.log('createAnswer', desc);
            self.pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', self.pc.localDescription);
                self.send_event(OFFER, self.pc.localDescription, { to: message.from });
            }, self.onSetSessionDescriptionError);
        }, self.onCreateSessionDescriptionError);
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
                console.log("setRemoteDescription complete");
                if (self.pc.remoteDescription.type == OFFER) {
                    self.createAnswer(message);
                }
            }, self.onSetSessionDescriptionError);
        }
        else if (message.type === ANSWER) {
        }
        else if (message.type === 'candidate') {
            console.log('exchange candidate', message);
            function onAddIceCandidateSuccess() {
                console.log('addIceCandidate success');
            }
            function onAddIceCandidateError(pc, error) {
                console.log('failed to add ICE Candidate: ' + error.toString());
            }
            self.pc.addIceCandidate(new RTCIceCandidate(message.candidate), onAddIceCandidateSuccess, onAddIceCandidateError);
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
    }
    ;
    getDataChannel(name) {
        let channel = this.channels[name];
        if (channel)
            return channel;
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
