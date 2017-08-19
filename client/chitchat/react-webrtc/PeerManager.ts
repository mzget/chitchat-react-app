import * as Peer from "./Peer";
import { WebRTC, logError } from "./WebRTC";

export class PeerManager {
    peers: Map<string, Peer.Peer>;

    constructor() {
        this.peers = new Map();
    }

    createPeer(options: { id, type, offer }, webrtc: WebRTC) {
        let self = this;

        let config = {
            peer_id: options.id,
            offer: options.offer,
            pcPeers: this.peers,
            stream: webrtc.userMedia.getLocalStream(),
            emitter: webrtc.webrtcEvents,
            sendHandler: webrtc.send
        };
        let peer = new Peer.Peer(config);
        peer.logError = logError;
        this.peers.set(options.id, peer);

        return peer;
    }

    getPeers(sessionId) {
        return this.peers.get(sessionId);
    };

    removePeers(sessionId, webrtc: WebRTC) {
        let peer = this.getPeers(sessionId);
        if (peer) {
            peer.pc.close();
            webrtc.webrtcEvents.emit(Peer.PEER_STREAM_REMOVED, peer.stream);
        }
        this.peers.delete(sessionId);
    };
}