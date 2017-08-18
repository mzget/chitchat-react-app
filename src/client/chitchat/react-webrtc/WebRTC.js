const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
import * as io from 'socket.io-client';
import * as events from "events";
import * as Peer from "./Peer";
function logError(error) {
    console.log("logError", error);
}
export class WebRTC {
    constructor(configs) {
        this.peers = {};
        this.webrtcEvents = new events.EventEmitter();
        let self = this;
        this.signalingSocket = io.connect(configs.signalingUrl, configs.socketOptions);
        this.exchange = this.exchange.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        self.signalingSocket.on('connect', function (data) {
            console.log("SOCKET connect", self.signalingSocket.id);
            self.webrtcEvents.emit(WebRTC.CONNECTION_READY, self.signalingSocket.id);
        });
        self.signalingSocket.on('message', function (data) {
            self.exchange(data);
        });
        self.signalingSocket.on('leave', function (socketId) {
            console.log("SOCKET leave", socketId);
            self.leave(socketId);
        });
        self.signalingSocket.on('remove', function (room) {
            console.log("SOCKET remove", room, self.signalingSocket.id);
            if (room.id !== self.signalingSocket.id) {
                self.leave(room.id);
            }
        });
        self.signalingSocket.on('disconnect', this.onDisconnect);
        self.signalingSocket.on('reconnect', (data) => {
            console.log("SOCKET reconnect", data);
        });
        self.signalingSocket.on('reconnectAttempt', (data) => {
            console.log("SOCKET reconnectAttempt", data);
        });
        self.signalingSocket.on('error', (data) => {
            console.log("SOCKET error", data);
        });
        self.signalingSocket.on('*', function (data) {
            console.log("SOCKET ***", data);
        });
    }
    send(messageType, payload, optional) {
        if (!this.signalingSocket)
            return;
        let self = this;
        let message = {
            to: optional.to,
            type: messageType,
            payload: payload,
        };
        self.signalingSocket.emit('message', message);
    }
    ;
    getLocalStream(requestMedia, callback) {
        let self = this;
        navigator.getUserMedia(requestMedia, function (stream) {
            self.localStream = stream;
            callback(stream);
        }, logError);
    }
    join(roomname) {
        let self = this;
        this.signalingSocket.emit('join', roomname, function (err, roomDescription) {
            console.log('join', roomDescription);
            if (err) {
                self.webrtcEvents.emit('error', err);
            }
            else {
                let id, client, type, peer;
                let clients = roomDescription.clients;
                for (id in clients) {
                    console.log("id", id);
                    if (clients.hasOwnProperty(id)) {
                        client = clients[id];
                        for (type in client) {
                            if (client[type]) {
                                peer = self.createPeer({
                                    id: id,
                                    type: type,
                                    offer: true
                                });
                                self.webrtcEvents.emit('createdPeer', peer);
                            }
                        }
                    }
                }
            }
            self.roomName = roomname;
            self.webrtcEvents.emit('joinedRoom', roomname);
        });
    }
    createPeer(options) {
        let self = this;
        let parents = {
            peer_id: options.id,
            offer: options.offer,
            stream: this.localStream,
            pcPeers: this.peers,
            emitter: this.webrtcEvents,
            sendHandler: this.send.bind(this)
        };
        let peer = new Peer.Peer(parents);
        peer.logError = logError;
        this.peers[options.id] = peer;
        return peer;
    }
    exchange(message) {
        let self = this;
        const fromId = message.from;
        const roomType = message.roomType;
        let peer = this.peers[fromId];
        if (message.type === 'offer') {
            if (!peer) {
                peer = self.createPeer({
                    id: message.from,
                    type: message.roomType,
                    offer: false,
                });
                self.webrtcEvents.emit('createdPeer', peer);
            }
            peer.handleMessage(message);
        }
    }
    leave(socketId) {
        console.log('leave', socketId);
        const peer = this.peers[socketId];
        if (peer) {
            peer.pc.close();
        }
        this.webrtcEvents.emit(Peer.PEER_STREAM_REMOVED);
        delete this.peers[socketId];
    }
    leaveRoom() {
        if (this.roomName) {
            this.signalingSocket.emit('leave');
            this.roomName = "";
        }
    }
    ;
    disconnect() {
        this.signalingSocket.disconnect();
        delete this.peers;
        delete this.signalingSocket;
    }
    ;
    onDisconnect(data) {
        console.log("SOCKET disconnect", data);
    }
}
WebRTC.CONNECTION_READY = "connectionReady";
