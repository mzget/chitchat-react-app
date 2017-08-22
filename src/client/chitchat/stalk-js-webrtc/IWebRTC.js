export var AbstractWEBRTC;
(function (AbstractWEBRTC) {
    AbstractWEBRTC.CONNECTION_READY = "connectionReady";
    AbstractWEBRTC.CREATED_PEER = "createdPeer";
    AbstractWEBRTC.JOINED_ROOM = "joinedRoom";
    AbstractWEBRTC.JOIN_ROOM_ERROR = "joinRoomError";
    AbstractWEBRTC.NOT_SUPPORT_MEDIA = "NOT_SUPPORT_MEDIA";
})(AbstractWEBRTC = AbstractWEBRTC || (AbstractWEBRTC = {}));
export var AbstractPeerConnection;
(function (AbstractPeerConnection) {
    AbstractPeerConnection.CANDIDATE = "candidate";
    AbstractPeerConnection.PEER_STREAM_ADDED = "peerStreamAdded";
    AbstractPeerConnection.PEER_STREAM_REMOVED = "peerStreamRemoved";
    AbstractPeerConnection.CONNECTIVITY_ERROR = "connectivityError";
    AbstractPeerConnection.MUTE = "mute";
    AbstractPeerConnection.UNMUTE = "unmute";
    AbstractPeerConnection.ANSWER = "answer";
    AbstractPeerConnection.OFFER = "offer";
})(AbstractPeerConnection = AbstractPeerConnection || (AbstractPeerConnection = {}));
export var AbstractMediaStream;
(function (AbstractMediaStream) {
    AbstractMediaStream.fullHdConstraints = {
        video: { width: { exact: 1920 }, height: { exact: 1080 } }
    };
    AbstractMediaStream.hdConstraints = {
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            }
        }
    };
    AbstractMediaStream.vgaConstraints = {
        video: {
            mandatory: {
                maxWidth: 640,
                maxHeight: 360
            }
        }
    };
    AbstractMediaStream.qvgaConstraints = {
        video: { width: { exact: 320 }, height: { exact: 240 } }
    };
})(AbstractMediaStream = AbstractMediaStream || (AbstractMediaStream = {}));
