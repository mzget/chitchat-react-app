/**
 * React,React-native webrtc peer implementation...
 * 
 * Copyright 2017 Ahoo Studio.co.th.
 */

import { EventEmitter } from "events";

import { AbstractPeerConnection } from "./";

export namespace AbstractPeer {
    export abstract class BasePeer implements AbstractPeerConnection.IPC_Handler {
        debug: boolean;
        type: string;
        parentsEmitter: EventEmitter;
        id: string;
        pc: RTCPeerConnection;
        enableDataChannels: boolean = true;
        receiveChannel;
        channels = {};
        pcPeers;
        browserPrefix: string;
        nick;
        offer: boolean;

        send_event: (messageType: string, payload?: any, optional?: { to: string }) => void;
        logError = (error) => {
            console.log(error);
        };

        /**
         * reture PeerConnection
         * @param socket 
         * @param stream 
         * @param options 
         */
        constructor(config: AbstractPeerConnection.PeerConstructor) {
            if (!config.stream) {
                throw new Error("Missing stream!!!");
            }

            this.debug = config.debug;
            this.id = config.peer_id;
            this.pcPeers = config.pcPeers;
            this.parentsEmitter = config.emitter;
            this.send_event = config.sendHandler;
            this.offer = config.offer;
        }

        removeStream(stream: MediaStream) {
            this.pc.removeStream(stream);
        }

        addStream(stream: MediaStream) {
            this.pc.addStream(stream);
        }


        onSetSessionDescriptionError(error) {
            console.warn('Failed to set session description: ' + error.toString());
        }
        onCreateSessionDescriptionError(error) {
            console.warn('Failed to create session description: ' + error.toString());
        }
        createOffer() {
            let self = this;

            this.pc.createOffer(function (desc) {
                if (self.debug)
                    console.log('createOffer Success');

                self.pc.setLocalDescription(desc, function () {
                    if (self.debug)
                        console.log('setLocalDescription Success');

                    self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: self.id });
                }, self.onSetSessionDescriptionError);
            }, self.onCreateSessionDescriptionError);
        }
        createAnswer(message) {
            let self = this;
            self.pc.createAnswer(function (desc) {
                if (self.debug)
                    console.log('createAnswer Success');

                self.pc.setLocalDescription(desc, function () {
                    if (self.debug)
                        console.log('setLocalDescription Success');

                    self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: message.from });
                }, self.onSetSessionDescriptionError);
            }, self.onCreateSessionDescriptionError);
        }
    }
}