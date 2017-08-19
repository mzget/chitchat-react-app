import * as Peer from "./Peer";
import { logError } from "./WebRTC";
export class PeerManager {
    constructor() {
        this.peers = new Map();
    }
    createPeer(options, webrtc) {
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
    }
    ;
    removePeers(sessionId, webrtc) {
        let peer = this.getPeers(sessionId);
        if (peer) {
            peer.pc.close();
            webrtc.webrtcEvents.emit(Peer.PEER_STREAM_REMOVED, peer.stream);
        }
        this.peers.delete(sessionId);
    }
    ;
}
