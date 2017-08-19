const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;

import * as io from 'socket.io-client';
import * as events from "events";
import * as Peer from "./Peer";
import { PeerManager } from "./PeerManager";

export function logError(error) {
    console.log("logError", error);
}

export class WebRTC {
    signalingSocket: SocketIOClient.Socket;  //{ transports: ['websocket'] }
    webrtcEvents = new events.EventEmitter();
    localStream;
    roomName: string;
    peerManager: PeerManager;
    debug: boolean = false;

    static CONNECTION_READY = "connectionReady";
    static CREATED_PEER = "createdPeer";
    static JOINED_ROOM = "joinedRoom"
    static JOIN_ROOM_ERROR = "joinRoomError";

    constructor(configs: { signalingUrl: string, socketOptions: any, debug: boolean }) {
        let self = this;
        self.debug = configs.debug;

        this.signalingSocket = io.connect(configs.signalingUrl, configs.socketOptions);

        this.exchange = this.exchange.bind(this);
        this.send = this.send.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);

        this.peerManager = new PeerManager();

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
                //@ Web
                // self.webrtc.removePeers(room.id, room.type);
                //@ Mobile
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
    send(messageType: string, payload?, optional?: { to: string }) {
        let self = this;
        if (!self.signalingSocket) return;

        let message = {
            to: optional.to,
            // sid: self.sid,
            // broadcaster: this.broadcaster,
            // roomType: self.type,
            type: messageType,
            payload: payload,
            // prefix: webrtcSupport.prefix
        };
        self.signalingSocket.emit('message', message);
    };

    getLocalStream(requestMedia: { video: boolean, audio: boolean }, callback: (stream) => void) {
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
                    // sid: message.sid,
                    type: message.roomType,
                    offer: false,
                    // enableDataChannels: self.config.enableDataChannels && message.roomType !== 'screen',
                    // sharemyscreen: message.roomType === 'screen' && !message.broadcaster,
                    // broadcaster: message.roomType === 'screen' && !message.broadcaster ? self.connection.getSessionid() : null
                }, self);
                self.webrtcEvents.emit(WebRTC.CREATED_PEER, peer);
            }

            peer.handleMessage(message);
        }
        // else if (peers.length) {
        //     peers.forEach(function (peer) {
        //         if (message.sid) {
        //             if (peer.sid === message.sid) {
        //                 peer.handleMessage(message);
        //             }
        //         } else {
        //             peer.handleMessage(message);
        //         }
        //     });
        // }
    }


    leaveRoom() {
        if (this.roomName) {
            this.signalingSocket.emit('leave');
            this.roomName = "";
        }
    };

    disconnect() {
        this.signalingSocket.disconnect();
        delete this.peerManager;
        delete this.signalingSocket;
    };

    onDisconnect(data) {
        console.log("SOCKET disconnect", data);
    }
}