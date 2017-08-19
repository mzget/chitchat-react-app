import * as Peer from "./Peer";
import { WebRTC, logError } from "./WebRTC";

export class PeerManager {
    peers: Map<string, Peer.Peer>;

    webrtc: WebRTC;

    constructor(webrtc) {
        this.webrtc = webrtc;
        this.peers = new Map();
    }

    createPeer(options: { id, type, offer }) {
        let self = this;

        let parents = {
            peer_id: options.id,
            offer: options.offer,
            pcPeers: this.peers,
            stream: self.webrtc.localStream,
            emitter: self.webrtc.webrtcEvents,
            sendHandler: self.webrtc.send
        };
        let peer = new Peer.Peer(parents);
        peer.logError = logError;
        this.peers.set(options.id, peer);

        return peer;
    }

    getPeers(sessionId) {
        return this.peers.get(sessionId);
    };

    removePeers(sessionId) {
        let peer = this.getPeers(sessionId);
        if (peer) {
            peer.pc.close();
            this.webrtc.webrtcEvents.emit(Peer.PEER_STREAM_REMOVED, peer.stream);
        }
        this.peers.delete(sessionId);
    };
}