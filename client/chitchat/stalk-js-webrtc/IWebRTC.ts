import * as events from 'events';

export namespace STALKWEBRTC {
    export const CONNECTION_READY = "connectionReady";
    export const CREATED_PEER = "createdPeer";
    export const JOINED_ROOM = "joinedRoom"
    export const JOIN_ROOM_ERROR = "joinRoomError";
    export const NOT_SUPPORT_MEDIA = "NOT_SUPPORT_MEDIA";
}
export interface IWebRTC {
    signalingSocket: SocketIOClient.Socket;
    webrtcEvents: events.EventEmitter;
    roomName: string;
    peerManager;
    userMedia: AbstractMediaStreamModule.IUserMedia;
    debug: boolean;

    send(messageType: string, payload: any, optionals: { to: string });
    join(roomname: string);
    leaveRoom();
    disconnect();
    onDisconnect(data);
}

export namespace PeerConnections {
    export const CANDIDATE = "candidate";
    export const PEER_STREAM_ADDED = "peerStreamAdded";
    export const PEER_STREAM_REMOVED = "peerStreamRemoved";
    export const CONNECTIVITY_ERROR = "connectivityError";
    export const MUTE = "mute";
    export const UNMUTE = "unmute";

    export const ANSWER = "answer";
    export const OFFER = "offer";
}

export namespace AbstractMediaStreamModule {

    export interface IUserMedia {
        debug: boolean;
        micController: AudioController;
        getLocalStream(): MediaStream;

        startLocalStream(mediaContraints: MediaStreamConstraints, isFront?: false): Promise<MediaStream>;
        setVideoEnabled(enable: boolean);
        stopLocalStream();
        stopStream();
    }

    export interface AudioController {
        //@ about mic-gainController in browser.
        support: boolean;
        mute();
        unMute();
        setVolume(volumn: number);
        getVolume();
        removeAudioStream();
    }
}   