/**
 * WebRtc Modules.
 *
 * Copyright 2017 Ahoo Studio.co.th.
 */
import * as events from 'events';

export namespace AbstractWEBRTC {
    export const CONNECTION_READY = "connectionReady";
    export const CREATED_PEER = "createdPeer";
    export const JOINED_ROOM = "joinedRoom"
    export const JOIN_ROOM_ERROR = "joinRoomError";
    export const NOT_SUPPORT_MEDIA = "NOT_SUPPORT_MEDIA";
    export interface WebRtcConfig {
        signalingUrl: string;
        socketOptions: any;
        debug: boolean;
        detectSpeakingEvents: boolean;
    }

    export interface IWebRTC {
        signalingSocket: SocketIOClient.Socket;
        webrtcEvents: events.EventEmitter;
        roomName: string;
        peerManager: AbstractPeerConnection.IPCEstabished;
        userMedia: AbstractMediaStream.IUserMedia;
        debug: boolean;

        send(messageType: string, payload: any, optionals: { to: string });
        join(roomname: string);
        leaveRoom();
        disconnect();
        onDisconnect(data);
    }
}

export namespace AbstractPeerConnection {
    export const CANDIDATE = "candidate";
    export const PEER_STREAM_ADDED = "peerStreamAdded";
    export const PEER_STREAM_REMOVED = "peerStreamRemoved";
    export const CONNECTIVITY_ERROR = "connectivityError";
    export const MUTE = "mute";
    export const UNMUTE = "unmute";

    export const ANSWER = "answer";
    export const OFFER = "offer";

    export interface IPCEstabished {
        createPeer(options, webrtc);
        getPeers(session_id?: string);
        removePeers(session_id: string, webrtc);

        sendToAll(message, payload);
        sendDirectlyToAll(channel: string, message, payload);
    }
}

export namespace AbstractMediaStream {
    export const fullHdConstraints = {
        video: { width: { exact: 1920 }, height: { exact: 1080 } }
    } as MediaStreamConstraints;

    export const hdConstraints = {
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            }
        }
    } as MediaStreamConstraints;

    export const vgaConstraints = {
        video: {
            mandatory: {
                maxWidth: 640,
                maxHeight: 360
            }
        }
    } as MediaStreamConstraints;

    export const qvgaConstraints = {
        video: { width: { exact: 320 }, height: { exact: 240 } }
    } as MediaStreamConstraints;

    export interface IUserMedia {
        debug: boolean;
        audioController: AudioController;
        getLocalStream(): MediaStream;
        getVideoTrackName(): string;
        getAudioTrackName(): string;

        startLocalStream(mediaContraints: MediaStreamConstraints, isFront?: false): Promise<MediaStream>;
        setVideoEnabled(enable: boolean);
        stopLocalStream();
    }

    export interface AudioController {
        //@ about mic-gainController in browser.
        support: boolean;
        mute();
        unMute();
        setVolume(volume: number);
        getVolume();
        removeAudioStream();
    }
}   