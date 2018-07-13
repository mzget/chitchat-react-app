// const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
// const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
import 'webrtc-adapter';
import * as io from 'socket.io-client';
import * as events from "events";

import { AbstractWEBRTC, withExchange, withSendMessage } from "../";
import * as Peer from "./Peer";
import { PeerManager } from "./PeerManager";
import { UserMedia } from "./UserMedia";

export function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

export class WebRTC implements AbstractWEBRTC.IWebRTC {
    signalingSocket: SocketIOClient.Socket;  //{ transports: ['websocket'] }
    webrtcEvents = new events.EventEmitter();
    roomName: string;
    peerManager: PeerManager;
    userMedia: UserMedia;
    debug: boolean = false;

    constructor(configs: AbstractWEBRTC.WebRtcConfig) {
        let self = this;
        self.debug = configs.debug;

        if (!hasGetUserMedia()) {
            alert('getUserMedia() is not supported in your browser');

            console.warn('Your browser does not support local media capture.');

            self.webrtcEvents.emit(AbstractWEBRTC.NOT_SUPPORT_MEDIA);
            return;
        }

        this.signalingSocket = io.connect(configs.signalingUrl, configs.socketOptions);

        this.send = this.send.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);

        this.peerManager = new PeerManager({ debug: self.debug });
        this.userMedia = new UserMedia({ debug: self.debug });

        self.signalingSocket.on('connect', function (data) {
            if (self.debug)
                console.log("SOCKET connect", self.signalingSocket.id);

            self.webrtcEvents.emit(AbstractWEBRTC.ON_CONNECTION_READY, self.signalingSocket.id);
        });
        self.signalingSocket.on('message', function (data) {
            withExchange(self)(data);
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

    // send via signalling channel
    send(messageType: string, payload, optional: { to: string }) {
        withSendMessage(this)(messageType, payload, optional);
    };

    join(roomname: string) {
        let self = this;
        this.signalingSocket.emit('join', roomname, function (err, roomDescription) {
            if (self.debug)
                console.log('join', roomDescription);

            if (err) {
                self.webrtcEvents.emit(AbstractWEBRTC.JOIN_ROOM_ERROR, err);
            }
            else {
                let id, client, type, peer;
                let clients = roomDescription.clients;
                for (id in clients) {
                    if (clients.hasOwnProperty(id)) {
                        client = clients[id];
                        for (type in client) {
                            if (client[type]) {
                                peer = self.peerManager.createPeer({
                                    id: id,
                                    type: type,
                                    offer: true
                                }, self);
                            }
                        }
                    }
                }
            }

            self.roomName = roomname;
            self.webrtcEvents.emit(AbstractWEBRTC.JOINED_ROOM, roomname);
        });
    }

    leaveRoom() {
        if (this.roomName) {
            this.signalingSocket.emit('leave');
            this.roomName = "";
        }
    };

    disconnect() {
        if (this.signalingSocket)
            this.signalingSocket.disconnect();
        if (this.userMedia)
            this.userMedia.stopLocalStream();
        if (this.peerManager && this.peerManager.peers.size > 0) {
            this.peerManager.peers.forEach(peer => peer.pcEvent.removeAllListeners());
        }
        delete this.peerManager;
        delete this.webrtcEvents;
        delete this.signalingSocket;
        delete this.userMedia;
    };

    onDisconnect(data) {
        if (this.debug)
            console.log("SOCKET disconnect", data);

        this.webrtcEvents.emit(AbstractWEBRTC.ON_CONNECTION_CLOSE, data);
        this.userMedia.stopLocalStream();
        if (this.peerManager && this.peerManager.peers.size > 0) {
            this.peerManager.peers.forEach(peer => peer.pcEvent.removeAllListeners());
        }
        delete this.peerManager;
        delete this.webrtcEvents;
        delete this.signalingSocket;
        delete this.userMedia;
    }
}