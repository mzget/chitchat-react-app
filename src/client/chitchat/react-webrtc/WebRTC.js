const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
import * as io from 'socket.io-client';
import * as events from "events";
import * as Peer from "./Peer";
function logError(error) {
    console.log("logError", error);
}
export class WebRtc {
    constructor() {
        this.peers = {};
        this.socket = io.connect('https://chitchats.ga:8888', { 'force new connection': true });
        this.myEmitter = new events.EventEmitter();
        let self = this;
        this.exchange = this.exchange.bind(this);
        self.socket.on('connect', function (data) {
            console.log("SOCKET connect", self.socket.id);
            self.myEmitter.emit('connectionReady', self.socket.id);
            self.getLocalStream(function (stream) {
                self.localStream = stream;
                self.myEmitter.emit("readyToCall", stream);
            });
        });
        self.socket.on('message', function (data) {
            self.exchange(data);
        });
        self.socket.on('leave', function (socketId) {
            console.log("SOCKET leave", socketId);
            self.leave(socketId);
        });
        self.socket.on('remove', function (room) {
            console.log("SOCKET remove", room, self.socket.id);
            if (room.id !== self.socket.id) {
                self.leave(room.id);
            }
        });
        self.socket.on('disconnect', (data) => {
            console.log("SOCKET disconnect", data);
        });
        self.socket.on('reconnect', (data) => {
            console.log("SOCKET reconnect", data);
        });
        self.socket.on('reconnectAttempt', (data) => {
            console.log("SOCKET reconnectAttempt", data);
        });
        self.socket.on('error', (data) => {
            console.log("SOCKET error", data);
        });
        self.socket.on('*', function (data) {
            console.log("SOCKET ***", data);
        });
    }
    send(messageType, payload, optional) {
        let self = this;
        let message = {
            to: optional.to,
            type: messageType,
            payload: payload,
        };
        self.socket.emit('message', message);
    }
    ;
    getLocalStream(callback) {
        let self = this;
        navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
            self.localStream = stream;
            callback(stream);
        }, logError);
    }
    join(roomname) {
        let self = this;
        this.socket.emit('join', roomname, function (err, roomDescription) {
            console.log('join', roomDescription);
            if (err) {
                self.myEmitter.emit('error', err);
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
                                self.myEmitter.emit('createdPeer', peer);
                            }
                        }
                    }
                }
            }
            self.roomName = roomname;
            self.myEmitter.emit('joinedRoom', roomname);
        });
    }
    createPeer(options) {
        let self = this;
        let parents = {
            peer_id: options.id,
            offer: options.offer,
            stream: this.localStream,
            pcPeers: this.peers,
            emitter: this.myEmitter,
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
                self.myEmitter.emit('createdPeer', peer);
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
        this.myEmitter.emit(Peer.PEER_STREAM_REMOVED);
        delete this.peers[socketId];
    }
    leaveRoom() {
        if (this.roomName) {
            this.socket.emit('leave');
            this.roomName = "";
        }
    }
    ;
    disconnect() {
        this.socket.disconnect();
        delete this.socket;
    }
    ;
}
