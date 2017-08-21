import * as io from 'socket.io-client';
import * as events from "events";
import { PeerManager } from "./PeerManager";
import { UserMedia } from "./UserMedia";
export function logError(error) {
    console.log("logError", error);
}
export function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
export class WebRTC {
    constructor(configs) {
        this.webrtcEvents = new events.EventEmitter();
        this.debug = false;
        let self = this;
        self.debug = configs.debug;
        if (!hasGetUserMedia()) {
            alert('getUserMedia() is not supported in your browser');
            logError('Your browser does not support local media capture.');
            self.webrtcEvents.emit(WebRTC.NOT_SUPPORT_MEDIA);
            return;
        }
        this.signalingSocket = io.connect(configs.signalingUrl, configs.socketOptions);
        this.exchange = this.exchange.bind(this);
        this.send = this.send.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.peerManager = new PeerManager({ debug: self.debug });
        this.userMedia = new UserMedia({ debug: self.debug });
        self.signalingSocket.on('connect', function (data) {
            if (self.debug)
                console.log("SOCKET connect", self.signalingSocket.id);
            self.webrtcEvents.emit(WebRTC.CONNECTION_READY, self.signalingSocket.id);
        });
        self.signalingSocket.on('message', function (data) {
            if (self.debug)
                console.log("SOCKET message ", data.type, data.from);
            self.exchange(data);
        });
        self.signalingSocket.on('remove', function (room) {
            if (self.debug)
                console.log("SOCKET remove", room, self.signalingSocket.id);
            if (room.id !== self.signalingSocket.id) {
                self.peerManager.removePeers(room.id, self);
            }
        });
        self.signalingSocket.on('leave', function (socketId) {
            if (self.debug)
                console.log("SOCKET leave", socketId);
            self.peerManager.removePeers(socketId, self);
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
        let self = this;
        if (!self.signalingSocket)
            return;
        let message = {
            to: optional.to,
            type: messageType,
            payload: payload,
        };
        self.signalingSocket.emit('message', message);
    }
    ;
    join(roomname) {
        let self = this;
        this.signalingSocket.emit('join', roomname, function (err, roomDescription) {
            console.log('join', roomDescription);
            if (err) {
                self.webrtcEvents.emit(WebRTC.JOIN_ROOM_ERROR, err);
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
                                peer = self.peerManager.createPeer({
                                    id: id,
                                    type: type,
                                    offer: true
                                }, self);
                                self.webrtcEvents.emit(WebRTC.CREATED_PEER, peer);
                            }
                        }
                    }
                }
            }
            self.roomName = roomname;
            self.webrtcEvents.emit(WebRTC.JOINED_ROOM, roomname);
        });
    }
    exchange(message) {
        let self = this;
        const fromId = message.from;
        const roomType = message.roomType;
        let peer = this.peerManager.getPeers(fromId);
        if (message.type === 'offer') {
            if (!peer) {
                peer = self.peerManager.createPeer({
                    id: message.from,
                    type: message.roomType,
                    offer: false,
                }, self);
                self.webrtcEvents.emit(WebRTC.CREATED_PEER, peer);
            }
            peer.handleMessage(message);
        }
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
        this.userMedia.stopLocalStream();
        delete this.peerManager;
        delete this.signalingSocket;
        delete this.userMedia;
    }
    ;
    onDisconnect(data) {
        console.log("SOCKET disconnect", data);
        this.userMedia.stopLocalStream();
    }
}
WebRTC.CONNECTION_READY = "connectionReady";
WebRTC.CREATED_PEER = "createdPeer";
WebRTC.JOINED_ROOM = "joinedRoom";
WebRTC.JOIN_ROOM_ERROR = "joinRoomError";
WebRTC.NOT_SUPPORT_MEDIA = "NOT_SUPPORT_MEDIA";
