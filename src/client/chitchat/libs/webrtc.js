var util = require('util');
var webrtcSupport = require('webrtcsupport');
var mockconsole = require('mockconsole');
import localMedia from './localmedia';
import Peer from './peer';
function WebRTC(opts) {
    var self = this;
    var options = opts || {};
    var config = this.config = {
        debug: false,
        peerConnectionConfig: {
            iceServers: [{ 'urls': 'stun:stun.l.google.com:19302' }]
        },
        peerConnectionConstraints: {
            optional: []
        },
        receiveMedia: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        },
        enableDataChannels: true
    };
    var item;
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
    if (!webrtcSupport.support) {
        this.logger.error('Your browser doesn\'t seem to support WebRTC');
    }
    this.peers = [];
    localMedia.call(this, this.config);
    this.on('speaking', function () {
        if (!self.hardMuted) {
            self.peers.forEach(function (peer) {
                if (peer.enableDataChannels) {
                    var dc = peer.getDataChannel('hark');
                    if (dc.readyState != 'open')
                        return;
                    dc.send(JSON.stringify({ type: 'speaking' }));
                }
            });
        }
    });
    this.on('stoppedSpeaking', function () {
        if (!self.hardMuted) {
            self.peers.forEach(function (peer) {
                if (peer.enableDataChannels) {
                    var dc = peer.getDataChannel('hark');
                    if (dc.readyState != 'open')
                        return;
                    dc.send(JSON.stringify({ type: 'stoppedSpeaking' }));
                }
            });
        }
    });
    this.on('volumeChange', function (volume, treshold) {
        if (!self.hardMuted) {
            self.peers.forEach(function (peer) {
                if (peer.enableDataChannels) {
                    var dc = peer.getDataChannel('hark');
                    if (dc.readyState != 'open')
                        return;
                    dc.send(JSON.stringify({ type: 'volume', volume: volume }));
                }
            });
        }
    });
    if (this.config.debug) {
        this.on('*', function (event, val1, val2) {
            var logger;
            if (self.config.logger === mockconsole) {
                logger = console;
            }
            else {
                logger = self.logger;
            }
            logger.log('event:', event, val1, val2);
        });
    }
}
util.inherits(WebRTC, localMedia);
WebRTC.prototype.createPeer = function (opts) {
    var peer;
    opts.parent = this;
    peer = new Peer(opts);
    this.peers.push(peer);
    return peer;
};
WebRTC.prototype.removePeers = function (id, type) {
    this.getPeers(id, type).forEach(function (peer) {
        peer.end();
    });
};
WebRTC.prototype.getPeers = function (sessionId, type) {
    return this.peers.filter(function (peer) {
        return (!sessionId || peer.id === sessionId) && (!type || peer.type === type);
    });
};
WebRTC.prototype.sendToAll = function (message, payload) {
    this.peers.forEach(function (peer) {
        peer.send(message, payload);
    });
};
WebRTC.prototype.sendDirectlyToAll = function (channel, message, payload) {
    this.peers.forEach(function (peer) {
        if (peer.enableDataChannels) {
            peer.sendDirectly(channel, message, payload);
        }
    });
};
export default WebRTC;
