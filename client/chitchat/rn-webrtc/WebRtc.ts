import { Platform } from 'react-native';
import * as events from 'events';
import * as io from 'socket.io-client';
import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

import * as Peer from "./Peer";

function logError(error) {
    console.log("logError", error);
}

export class WebRtc {
    peers = {};
    signalingSocket: SocketIOClient.Socket; //{ transports: ['websocket'] }
    webrtcEvents: events.EventEmitter;
    localStream;
    roomName: string;

    static CONNECTION_READY = "connectionReady";
    static READY_TO_CALL = "readyToCall";

    constructor() {
        let self = this;
        this.signalingSocket = io.connect('https://chitchats.ga:8888', { transports: ['websocket'], 'force new connection': true });
        this.webrtcEvents = new events.EventEmitter();
        this.exchange = this.exchange.bind(this);

        self.signalingSocket.on('connect', function (data) {
            console.log("SOCKET connect", self.signalingSocket.id, data);

            self.webrtcEvents.emit(WebRtc.CONNECTION_READY, self.signalingSocket.id);
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
                //@ Web
                // self.webrtc.removePeers(room.id, room.type);
                //@ Mobile
                self.leave(room.id);
            }
        });
        self.signalingSocket.on('disconnect', (data) => {
            console.log("SOCKET disconnect", data);
        });
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

    getLocalStream(isFront, callback: (stream) => void) {
        let self = this;
        let videoSourceId;

        // on android, you don't have to specify sourceId manually, just use facingMode
        // uncomment it if you want to specify
        if (Platform.OS === 'ios') {
            MediaStreamTrack.getSources(sourceInfos => {
                // console.log("sourceInfos: ", sourceInfos);

                for (var i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                        videoSourceId = sourceInfo.id;
                    }
                }
            });
        }

        getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minWidth: 640, // Provide your own width, height and frame rate here
                    minHeight: 360,
                    minFrameRate: 30,
                },
                facingMode: (isFront ? "user" : "environment"),
                optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
            }
        }, function (stream) {
            console.log('getUserMedia success');

            self.localStream = stream;
            callback(stream);
        },
            (err) => console.log("logError", err));
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

    createPeer(options: { id, type, offer }) {
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
                    // sid: message.sid,
                    type: message.roomType,
                    offer: false,
                    // enableDataChannels: self.config.enableDataChannels && message.roomType !== 'screen',
                    // sharemyscreen: message.roomType === 'screen' && !message.broadcaster,
                    // broadcaster: message.roomType === 'screen' && !message.broadcaster ? self.connection.getSessionid() : null
                });
                self.webrtcEvents.emit('createdPeer', peer);
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

    leave(socketId) {
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
    };

    disconnect() {
        this.signalingSocket.disconnect();
        delete this.signalingSocket;
        delete this.peers;
    };
}