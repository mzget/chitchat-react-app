/**
 * WebRtc Modules.
 *
 * Copyright 2017 Ahoo Studio.co.th.
 */
import * as events from 'events';

export namespace AbstractWEBRTC {
    export const ON_CONNECTION_READY = "connectionReady";
    export const ON_CONNECTION_CLOSE = "ON_CONNECTION_CLOSE";
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
    export const ON_ICE_CONNECTION_FAILED = "iceFailed";
    export const MUTE = "mute";
    export const UNMUTE = "unmute";
    export const PAUSE = "pause"; // for video
    export const UNPAUSE = "unpause"; // for video
    export const DUMMY_VIDEO = "dummy_video"; // for video

    export const ANSWER = "answer";
    export const OFFER = "offer";

    export interface IPCEstabished {
        createPeer(options, webrtc): AbstractPeerConnection.IPCHandler;
        getPeers(session_id?: string): AbstractPeerConnection.IPCHandler | Map<string, AbstractPeerConnection.IPCHandler>;
        removePeers(session_id: string, webrtc);

        sendToAll(message, payload);
        sendDirectlyToAll(channel: string, message, payload);
    }

    export interface IPCHandler {
        id: string;
        pc: RTCPeerConnection;
        channels: any;
        addStream(stream: MediaStream);
        removeStream(stream: MediaStream);
        handleMessage(message);
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
        video: {
            mandatory: {
                maxWidth: 320,
                maxHeight: 240
            }
        }
    } as MediaStreamConstraints;

    export interface IUserMedia {
        debug: boolean;
        audioController: AudioController;
        videoController: VideoController;
        getLocalStream(): MediaStream;
        setLocalStream(stream: MediaStream);
        getVideoTrackName(): string;
        getAudioTrackName(): string;

        startLocalStream(mediaContraints: MediaStreamConstraints, isFront?: false): Promise<MediaStream>;
        stopLocalStream();
    }

    export interface AudioController {
        //@ about mic-gainController in browser.
        support: boolean;
        volume: number;
        audioSource: AudioTrack;
        mute();
        unMute();
        setVolume(volume: number);
        getVolume();
        removeAudioStream();
    }

    export interface VideoController {
        //@ about video stream in browser.
        localStream: MediaStream;
        videoSource: VideoTrack;
        setVideoEnabled(enabled: boolean);
    }
}   