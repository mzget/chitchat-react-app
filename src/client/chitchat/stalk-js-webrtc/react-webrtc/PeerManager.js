import { AbstractPeerConnection } from "../IWebRTC";
import { Peer } from "./Peer";
import { logError } from "./WebRTC";
export class PeerManager {
    constructor(options) {
        this.debug = false;
        this.peers = new Map();
        this.debug = options.debug;
    }
    createPeer(options, webrtc) {
        let self = this;
        let config = {
            peer_id: options.id,
            offer: options.offer,
            pcPeers: this.peers,
            stream: webrtc.userMedia.getLocalStream(),
            emitter: webrtc.webrtcEvents,
            sendHandler: webrtc.send,
            debug: self.debug
        };
        let peer = new Peer(config);
        peer.logError = logError;
        this.peers.set(options.id, peer);
        return peer;
    }
    getPeers(sessionId) {
        if (!!sessionId) {
            return this.peers.get(sessionId);
        }
        else {
            return this.peers;
        }
    }
    ;
    removePeers(sessionId, webrtc) {
        let peer = this.getPeers(sessionId);
        if (peer) {
            peer.pc.close();
            webrtc.webrtcEvents.emit(AbstractPeerConnection.PEER_STREAM_REMOVED, peer.stream);
        }
        this.peers.delete(sessionId);
    }
    ;
    sendToAll(message, payload) {
        this.peers.forEach(function (peer) {
            peer.send_event(message, payload, { to: peer.id });
        });
    }
    ;
    sendDirectlyToAll(channel, message, payload) {
        this.peers.forEach(function (peer) {
            if (peer.enableDataChannels) {
                peer.sendDirectly(channel, message, payload);
            }
        });
    }
    ;
}
