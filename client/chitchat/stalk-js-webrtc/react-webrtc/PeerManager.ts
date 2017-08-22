import { AbstractPeerConnection } from "../IWebRTC";
import * as Peer from "./Peer";
import { WebRTC, logError } from "./WebRTC";

export class PeerManager implements AbstractPeerConnection.IPCEstabished {
    peers: Map<string, Peer.Peer>;
    debug: boolean = false;

    constructor(options: { debug: boolean }) {
        this.peers = new Map();
        this.debug = options.debug;
    }

    createPeer(options: { id, type, offer }, webrtc: WebRTC) {
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
        let peer = new Peer.Peer(config);
        peer.logError = logError;
        this.peers.set(options.id, peer);

        return peer;
    }

    getPeers(sessionId?: string) {
        if (sessionId) {
            return this.peers.get(sessionId);
        }
        else {
            return this.peers;
        }
    };

    removePeers(sessionId, webrtc: WebRTC) {
        let peer = this.getPeers(sessionId) as Peer.Peer;
        if (peer) {
            peer.pc.close();
            webrtc.webrtcEvents.emit(AbstractPeerConnection.PEER_STREAM_REMOVED, peer.stream);
        }
        this.peers.delete(sessionId);
    };

    /**
     * sends message to all 
     * use signalling message.
     * 
     * @param {any} message 
     * @param {any} payload 
     * @memberof PeerManager
     */
    sendToAll(message, payload) {
        this.peers.forEach(function (peer) {
            peer.send_event(message, payload, { to: peer.id });
        });
    };

    // sends message to all using a datachannel
    // only sends to anyone who has an open datachannel
    sendDirectlyToAll(channel, message, payload) {
        this.peers.forEach(function (peer) {
            if (peer.enableDataChannels) {
                peer.sendDirectly(channel, message, payload);
            }
        });
    };
}