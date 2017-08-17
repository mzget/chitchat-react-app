import WebRTC from './webrtc';
import SocketIoConnection from './socketioconnection';
const WildEmitter = require('wildemitter');
const webrtcSupport = require('webrtcsupport');
const attachMediaStream = require('attachmediastream');
const mockconsole = require('mockconsole');
class SimpleWebRTC extends WildEmitter {
    constructor(opts) {
        super();
        this.testReadiness = function () {
            var self = this;
            if (this.sessionReady) {
                if (!this.config.media.video && !this.config.media.audio) {
                    self.emit('readyToCall', self.connection.getSessionid());
                }
                else if (this.webrtc.localStreams.length > 0) {
                    self.emit('readyToCall', self.connection.getSessionid());
                }
                else {
                    self.emit('readyToCall', self.connection.getSessionid());
                }
            }
        };
        this.handlePeerStreamAdded = function (peer) {
            var self = this;
            var container = this.getRemoteVideoContainer();
            var video = attachMediaStream(peer.stream);
            peer.videoEl = video;
            video.id = this.getDomId(peer);
            if (container)
                container.appendChild(video);
            this.emit('videoAdded', video, peer);
            window.setTimeout(function () {
                if (!self.webrtc.isAudioEnabled()) {
                    peer.send('mute', { name: 'audio' });
                }
                if (!self.webrtc.isVideoEnabled()) {
                    peer.send('mute', { name: 'video' });
                }
            }, 250);
        };
        this.getEl = function (idOrEl) {
            if (typeof idOrEl === 'string') {
                return document.getElementById(idOrEl);
            }
            else {
                return idOrEl;
            }
        };
        this.leaveRoom = function () {
            if (this.roomName) {
                this.connection.emit('leave');
                while (this.webrtc.peers.length) {
                    this.webrtc.peers[0].end();
                }
                if (this.getLocalScreen()) {
                    this.stopScreenShare();
                }
                this.emit('leftRoom', this.roomName);
                this.roomName = undefined;
            }
        };
        this.disconnect = function () {
            this.connection.disconnect();
            delete this.connection;
        };
        this.handlePeerStreamRemoved = function (peer) {
            var container = this.getRemoteVideoContainer();
            var videoEl = peer.videoEl;
            if (this.config.autoRemoveVideos && container && videoEl) {
                container.removeChild(videoEl);
            }
            if (videoEl)
                this.emit('videoRemoved', videoEl, peer);
        };
        this.getDomId = function (peer) {
            return [peer.id, peer.type, peer.broadcaster ? 'broadcasting' : 'incoming'].join('_');
        };
        this.setVolumeForAll = function (volume) {
            this.webrtc.peers.forEach(function (peer) {
                if (peer.videoEl)
                    peer.videoEl.volume = volume;
            });
        };
        this.joinRoom = function (name, cb) {
            var self = this;
            this.roomName = name;
            this.connection.emit('join', name, function (err, roomDescription) {
                console.log('join CB', err, roomDescription);
                if (err) {
                    self.emit('error', err);
                }
                else if (Object.keys(roomDescription.clients).length === 0) {
                    self.emit('error', "roomDescription clients empty");
                }
                else {
                    let id, client, type, peer;
                    for (id in roomDescription.clients) {
                        client = roomDescription.clients[id];
                        for (type in client) {
                            if (client[type]) {
                                peer = self.webrtc.createPeer({
                                    id: id,
                                    type: type,
                                    enableDataChannels: self.config.enableDataChannels && type !== 'screen',
                                    receiveMedia: {
                                        offerToReceiveAudio: type !== 'screen' && self.config.receiveMedia.offerToReceiveAudio ? 1 : 0,
                                        offerToReceiveVideo: self.config.receiveMedia.offerToReceiveVideo
                                    }
                                });
                                self.emit('createdPeer', peer);
                                peer.start();
                            }
                        }
                    }
                }
                if (cb)
                    cb(err, roomDescription);
                self.emit('joinedRoom', name);
            });
        };
        this.startLocalVideo = function () {
            var self = this;
            this.webrtc.start(this.config.media, function (err, stream) {
                if (err) {
                    self.emit('localMediaError', err);
                    self.config.localVideoEl.style.background = 'black';
                }
                else {
                    attachMediaStream(stream, self.getLocalVideoContainer(), self.config.localVideo);
                }
            });
        };
        this.stopLocalVideo = function () {
            this.webrtc.stop();
        };
        this.getLocalVideoContainer = function () {
            var el = this.getEl(this.config.localVideoEl);
            if (el && el.tagName === 'VIDEO') {
                el.oncontextmenu = function () { return false; };
                return el;
            }
            else if (el) {
                var video = document.createElement('video');
                video.oncontextmenu = function () { return false; };
                el.appendChild(video);
                return video;
            }
            else {
                return;
            }
        };
        this.getRemoteVideoContainer = function () {
            return this.getEl(this.config.remoteVideosEl);
        };
        this.shareScreen = function (cb) {
            this.webrtc.startScreenShare(cb);
        };
        this.getLocalScreen = function () {
            return this.webrtc.localScreens && this.webrtc.localScreens[0];
        };
        this.stopScreenShare = function () {
            this.connection.emit('unshareScreen');
            var videoEl = document.getElementById('localScreen');
            var container = this.getRemoteVideoContainer();
            if (this.config.autoRemoveVideos && container && videoEl) {
                container.removeChild(videoEl);
            }
            if (videoEl) {
                this.emit('videoRemoved', videoEl);
            }
            if (this.getLocalScreen()) {
                this.webrtc.stopScreenShare();
            }
            this.webrtc.peers.forEach(function (peer) {
                if (peer.broadcaster) {
                    peer.end();
                }
            });
        };
        this.createRoom = function (name, cb) {
            this.roomName = name;
            if (arguments.length === 2) {
                this.connection.emit('create', name, cb);
            }
            else {
                this.connection.emit('create', name);
            }
        };
        this.sendFile = function () {
            if (!webrtcSupport.dataChannel) {
                return this.emit('error', new Error('DataChannelNotSupported'));
            }
        };
        let self = this;
        let options = opts || {};
        let config = this.config = {
            url: 'https://sandbox.simplewebrtc.com:443/',
            socketio: {},
            connection: null,
            debug: false,
            localVideoEl: '',
            remoteVideosEl: '',
            enableDataChannels: true,
            autoRequestMedia: false,
            autoRemoveVideos: true,
            adjustPeerVolume: false,
            peerVolumeWhenSpeaking: 0.25,
            media: {
                video: true,
                audio: true
            },
            receiveMedia: {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            },
            localVideo: {
                autoplay: true,
                mirror: true,
                muted: true
            }
        };
        var item;
        var connection;
        this.logger = function () {
            if (opts.debug) {
                return opts.logger || console;
            }
            else {
                return opts.logger || mockconsole;
            }
        }();
        for (item in options) {
            if (options.hasOwnProperty(item)) {
                this.config[item] = options[item];
            }
        }
        this.capabilities = webrtcSupport;
        WildEmitter.call(this);
        if (this.config.connection === null) {
            connection = this.connection = new SocketIoConnection(this.config);
        }
        else {
            connection = this.connection = this.config.connection;
        }
        connection.on('connect', function () {
            console.log("connection connect", connection.getSessionid());
            self.emit('connectionReady', connection.getSessionid());
            self.sessionReady = true;
            self.testReadiness();
        });
        connection.on('message', function (message) {
            var peers = self.webrtc.getPeers(message.from, message.roomType);
            var peer;
            if (message.type === 'offer') {
                if (peers.length) {
                    peers.forEach(function (p) {
                        if (p.sid == message.sid)
                            peer = p;
                    });
                }
                if (!peer) {
                    peer = self.webrtc.createPeer({
                        id: message.from,
                        sid: message.sid,
                        type: message.roomType,
                        enableDataChannels: self.config.enableDataChannels && message.roomType !== 'screen',
                        sharemyscreen: message.roomType === 'screen' && !message.broadcaster,
                        broadcaster: message.roomType === 'screen' && !message.broadcaster ? self.connection.getSessionid() : null
                    });
                    self.emit('createdPeer', peer);
                }
                peer.handleMessage(message);
            }
            else if (peers.length) {
                peers.forEach(function (peer) {
                    if (message.sid) {
                        if (peer.sid === message.sid) {
                            peer.handleMessage(message);
                        }
                    }
                    else {
                        peer.handleMessage(message);
                    }
                });
            }
        });
        connection.on('remove', function (room) {
            console.log("connection remove", room);
            if (room.id !== self.connection.getSessionid()) {
                self.webrtc.removePeers(room.id, room.type);
            }
        });
        opts.logger = this.logger;
        opts.debug = false;
        this.webrtc = new WebRTC(opts);
        ['mute', 'unmute', 'pauseVideo', 'resumeVideo', 'pause', 'resume', 'sendToAll', 'sendDirectlyToAll', 'getPeers'].forEach(function (method) {
            self[method] = self.webrtc[method].bind(self.webrtc);
        });
        this.webrtc.on('*', function () {
            self.emit.apply(self, arguments);
        });
        if (config.debug) {
            this.on('*', this.logger.log.bind(this.logger, 'SimpleWebRTC event:'));
        }
        this.webrtc.on('localStream', function () {
            self.testReadiness();
        });
        this.webrtc.on('message', function (payload) {
            self.connection.emit('message', payload);
        });
        this.webrtc.on('peerStreamAdded', this.handlePeerStreamAdded.bind(this));
        this.webrtc.on('peerStreamRemoved', this.handlePeerStreamRemoved.bind(this));
        if (this.config.adjustPeerVolume) {
            this.webrtc.on('speaking', this.setVolumeForAll.bind(this, this.config.peerVolumeWhenSpeaking));
            this.webrtc.on('stoppedSpeaking', this.setVolumeForAll.bind(this, 1));
        }
        connection.on('stunservers', function (args) {
            console.log("connection stunservers", args);
            self.webrtc.config.peerConnectionConfig.iceServers = args;
            self.emit('stunservers', args);
        });
        connection.on('turnservers', function (args) {
            console.log("connection turnservers", args);
            self.webrtc.config.peerConnectionConfig.iceServers = self.webrtc.config.peerConnectionConfig.iceServers.concat(args);
            self.emit('turnservers', args);
        });
        this.webrtc.on('iceFailed', function (peer) {
        });
        this.webrtc.on('connectivityError', function (peer) {
        });
        this.webrtc.on('audioOn', function () {
            self.webrtc.sendToAll('unmute', { name: 'audio' });
        });
        this.webrtc.on('audioOff', function () {
            self.webrtc.sendToAll('mute', { name: 'audio' });
        });
        this.webrtc.on('videoOn', function () {
            self.webrtc.sendToAll('unmute', { name: 'video' });
        });
        this.webrtc.on('videoOff', function () {
            self.webrtc.sendToAll('mute', { name: 'video' });
        });
        this.webrtc.on('localScreen', function (stream) {
            var item, el = document.createElement('video'), container = self.getRemoteVideoContainer();
            el.oncontextmenu = function () { return false; };
            el.id = 'localScreen';
            attachMediaStream(stream, el);
            if (container) {
                container.appendChild(el);
            }
            self.emit('localScreenAdded', el);
            self.connection.emit('shareScreen');
            self.webrtc.peers.forEach(function (existingPeer) {
                var peer;
                if (existingPeer.type === 'video') {
                    peer = self.webrtc.createPeer({
                        id: existingPeer.id,
                        type: 'screen',
                        sharemyscreen: true,
                        enableDataChannels: false,
                        receiveMedia: {
                            offerToReceiveAudio: 0,
                            offerToReceiveVideo: 0
                        },
                        broadcaster: self.connection.getSessionid(),
                    });
                    self.emit('createdPeer', peer);
                    peer.start();
                }
            });
        });
        this.webrtc.on('localScreenStopped', function (stream) {
            if (self.getLocalScreen()) {
                self.stopScreenShare();
            }
        });
        this.webrtc.on('channelMessage', function (peer, label, data) {
            if (data.type == 'volume') {
                self.emit('remoteVolumeChange', peer, data.volume);
            }
        });
        if (this.config.autoRequestMedia)
            this.startLocalVideo();
    }
}
SimpleWebRTC.prototype = Object.create(WildEmitter.prototype, {
    constructor: {
        value: SimpleWebRTC
    }
});
export default SimpleWebRTC;
