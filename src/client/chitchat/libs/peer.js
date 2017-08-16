var util = require('util');
var webrtcSupport = require('webrtcsupport');
var PeerConnection = require('rtcpeerconnection');
var WildEmitter = require('wildemitter');
var FileTransfer = require('filetransfer');
var INBAND_FILETRANSFER_V1 = 'https://simplewebrtc.com/protocol/filetransfer#inband-v1';
function isAllTracksEnded(stream) {
    var isAllTracksEnded = true;
    stream.getTracks().forEach(function (t) {
        isAllTracksEnded = t.readyState === 'ended' && isAllTracksEnded;
    });
    return isAllTracksEnded;
}
function Peer(options) {
    var self = this;
    WildEmitter.call(this);
    this.id = options.id;
    this.parent = options.parent;
    this.type = options.type || 'video';
    this.oneway = options.oneway || false;
    this.sharemyscreen = options.sharemyscreen || false;
    this.browserPrefix = options.prefix;
    this.stream = options.stream;
    this.enableDataChannels = options.enableDataChannels === undefined ? this.parent.config.enableDataChannels : options.enableDataChannels;
    this.receiveMedia = options.receiveMedia || this.parent.config.receiveMedia;
    this.channels = {};
    this.sid = options.sid || Date.now().toString();
    this.pc = new PeerConnection(this.parent.config.peerConnectionConfig, this.parent.config.peerConnectionConstraints);
    this.pc.on('ice', this.onIceCandidate.bind(this));
    this.pc.on('endOfCandidates', function (event) {
        self.send('endOfCandidates', event);
    });
    this.pc.on('offer', function (offer) {
        if (self.parent.config.nick)
            offer.nick = self.parent.config.nick;
        self.send('offer', offer);
    });
    this.pc.on('answer', function (answer) {
        if (self.parent.config.nick)
            answer.nick = self.parent.config.nick;
        self.send('answer', answer);
    });
    this.pc.on('addStream', this.handleRemoteStreamAdded.bind(this));
    this.pc.on('addChannel', this.handleDataChannelAdded.bind(this));
    this.pc.on('removeStream', this.handleStreamRemoved.bind(this));
    this.pc.on('negotiationNeeded', this.emit.bind(this, 'negotiationNeeded'));
    this.pc.on('iceConnectionStateChange', this.emit.bind(this, 'iceConnectionStateChange'));
    this.pc.on('iceConnectionStateChange', function () {
        switch (self.pc.iceConnectionState) {
            case 'failed':
                if (self.pc.pc.localDescription.type === 'offer') {
                    self.parent.emit('iceFailed', self);
                    self.send('connectivityError');
                }
                break;
        }
    });
    this.pc.on('signalingStateChange', this.emit.bind(this, 'signalingStateChange'));
    this.logger = this.parent.logger;
    if (options.type === 'screen') {
        if (this.parent.localScreens && this.parent.localScreens[0] && this.sharemyscreen) {
            this.logger.log('adding local screen stream to peer connection');
            this.pc.addStream(this.parent.localScreens[0]);
            this.broadcaster = options.broadcaster;
        }
    }
    else {
        this.parent.localStreams.forEach(function (stream) {
            self.pc.addStream(stream);
        });
    }
    this.on('channelOpen', function (channel) {
        if (channel.protocol === INBAND_FILETRANSFER_V1) {
            channel.onmessage = function (event) {
                var metadata = JSON.parse(event.data);
                var receiver = new FileTransfer.Receiver();
                receiver.receive(metadata, channel);
                self.emit('fileTransfer', metadata, receiver);
                receiver.on('receivedFile', function (file, metadata) {
                    receiver.channel.close();
                });
            };
        }
    });
    this.on('*', function () {
        self.parent.emit.apply(self.parent, arguments);
    });
}
util.inherits(Peer, WildEmitter);
Peer.prototype.handleMessage = function (message) {
    var self = this;
    this.logger.log('getting', message.type, message);
    if (message.prefix)
        this.browserPrefix = message.prefix;
    if (message.type === 'offer') {
        if (!this.nick)
            this.nick = message.payload.nick;
        delete message.payload.nick;
        this.pc.handleOffer(message.payload, function (err) {
            if (err) {
                return;
            }
            self.pc.answer(function (err, sessionDescription) {
            });
        });
    }
    else if (message.type === 'answer') {
        if (!this.nick)
            this.nick = message.payload.nick;
        delete message.payload.nick;
        this.pc.handleAnswer(message.payload);
    }
    else if (message.type === 'candidate') {
        this.pc.processIce(message.payload);
    }
    else if (message.type === 'connectivityError') {
        this.parent.emit('connectivityError', self);
    }
    else if (message.type === 'mute') {
        this.parent.emit('mute', { id: message.from, name: message.payload.name });
    }
    else if (message.type === 'unmute') {
        this.parent.emit('unmute', { id: message.from, name: message.payload.name });
    }
    else if (message.type === 'endOfCandidates') {
        var mLines = this.pc.pc.transceivers || [];
        mLines.forEach(function (mLine) {
            if (mLine.iceTransport) {
                mLine.iceTransport.addRemoteCandidate({});
            }
        });
    }
};
Peer.prototype.send = function (messageType, payload) {
    var message = {
        to: this.id,
        sid: this.sid,
        broadcaster: this.broadcaster,
        roomType: this.type,
        type: messageType,
        payload: payload,
        prefix: webrtcSupport.prefix
    };
    this.logger.log('sending', messageType, message);
    this.parent.emit('message', message);
};
Peer.prototype.sendDirectly = function (channel, messageType, payload) {
    var message = {
        type: messageType,
        payload: payload
    };
    this.logger.log('sending via datachannel', channel, messageType, message);
    var dc = this.getDataChannel(channel);
    if (dc.readyState != 'open')
        return false;
    dc.send(JSON.stringify(message));
    return true;
};
Peer.prototype._observeDataChannel = function (channel) {
    var self = this;
    channel.onclose = this.emit.bind(this, 'channelClose', channel);
    channel.onerror = this.emit.bind(this, 'channelError', channel);
    channel.onmessage = function (event) {
        self.emit('channelMessage', self, channel.label, JSON.parse(event.data), channel, event);
    };
    channel.onopen = this.emit.bind(this, 'channelOpen', channel);
};
Peer.prototype.getDataChannel = function (name, opts) {
    if (!webrtcSupport.supportDataChannel)
        return this.emit('error', new Error('createDataChannel not supported'));
    var channel = this.channels[name];
    opts || (opts = {});
    if (channel)
        return channel;
    channel = this.channels[name] = this.pc.createDataChannel(name, opts);
    this._observeDataChannel(channel);
    return channel;
};
Peer.prototype.onIceCandidate = function (candidate) {
    if (this.closed)
        return;
    if (candidate) {
        var pcConfig = this.parent.config.peerConnectionConfig;
        if (webrtcSupport.prefix === 'moz' && pcConfig && pcConfig.iceTransports &&
            candidate.candidate && candidate.candidate.candidate &&
            candidate.candidate.candidate.indexOf(pcConfig.iceTransports) < 0) {
            this.logger.log('Ignoring ice candidate not matching pcConfig iceTransports type: ', pcConfig.iceTransports);
        }
        else {
            this.send('candidate', candidate);
        }
    }
    else {
        this.logger.log("End of candidates.");
    }
};
Peer.prototype.start = function () {
    var self = this;
    if (this.enableDataChannels) {
        this.getDataChannel('simplewebrtc');
    }
    this.pc.offer(this.receiveMedia, function (err, sessionDescription) {
    });
};
Peer.prototype.icerestart = function () {
    var constraints = this.receiveMedia;
    constraints.mandatory.IceRestart = true;
    this.pc.offer(constraints, function (err, success) { });
};
Peer.prototype.end = function () {
    if (this.closed)
        return;
    this.pc.close();
    this.handleStreamRemoved();
};
Peer.prototype.handleRemoteStreamAdded = function (event) {
    var self = this;
    if (this.stream) {
        this.logger.warn('Already have a remote stream');
    }
    else {
        this.stream = event.stream;
        this.stream.getTracks().forEach(function (track) {
            track.addEventListener('ended', function () {
                if (isAllTracksEnded(self.stream)) {
                    self.end();
                }
            });
        });
        this.parent.emit('peerStreamAdded', this);
    }
};
Peer.prototype.handleStreamRemoved = function () {
    var peerIndex = this.parent.peers.indexOf(this);
    if (peerIndex > -1) {
        this.parent.peers.splice(peerIndex, 1);
        this.closed = true;
        this.parent.emit('peerStreamRemoved', this);
    }
};
Peer.prototype.handleDataChannelAdded = function (channel) {
    this.channels[channel.label] = channel;
    this._observeDataChannel(channel);
};
Peer.prototype.sendFile = function (file) {
    var sender = new FileTransfer.Sender();
    var dc = this.getDataChannel('filetransfer' + (new Date()).getTime(), {
        protocol: INBAND_FILETRANSFER_V1
    });
    dc.onopen = function () {
        dc.send(JSON.stringify({
            size: file.size,
            name: file.name
        }));
        sender.send(file, dc);
    };
    dc.onclose = function () {
        console.log('sender received transfer');
        sender.emit('complete');
    };
    return sender;
};
export default Peer;
