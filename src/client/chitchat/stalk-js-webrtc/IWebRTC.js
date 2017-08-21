export var STALKWEBRTC;
(function (STALKWEBRTC) {
    STALKWEBRTC.CONNECTION_READY = "connectionReady";
    STALKWEBRTC.CREATED_PEER = "createdPeer";
    STALKWEBRTC.JOINED_ROOM = "joinedRoom";
    STALKWEBRTC.JOIN_ROOM_ERROR = "joinRoomError";
    STALKWEBRTC.NOT_SUPPORT_MEDIA = "NOT_SUPPORT_MEDIA";
})(STALKWEBRTC = STALKWEBRTC || (STALKWEBRTC = {}));
export var PeerConnections;
(function (PeerConnections) {
    PeerConnections.CANDIDATE = "candidate";
    PeerConnections.PEER_STREAM_ADDED = "peerStreamAdded";
    PeerConnections.PEER_STREAM_REMOVED = "peerStreamRemoved";
    PeerConnections.CONNECTIVITY_ERROR = "connectivityError";
    PeerConnections.MUTE = "mute";
    PeerConnections.UNMUTE = "unmute";
    PeerConnections.ANSWER = "answer";
    PeerConnections.OFFER = "offer";
})(PeerConnections = PeerConnections || (PeerConnections = {}));
