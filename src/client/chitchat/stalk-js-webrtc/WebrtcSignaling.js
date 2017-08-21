import { AbstractWEBRTC } from "./index";
export function withExchange(webrtcObject) {
    return function exchange(message) {
        let self = webrtcObject;
        const fromId = message.from;
        const roomType = message.roomType;
        let peer = self.peerManager.getPeers(fromId);
        if (message.type === 'offer') {
            if (!peer) {
                peer = self.peerManager.createPeer({
                    id: message.from,
                    type: message.roomType,
                    offer: false,
                }, self);
                self.webrtcEvents.emit(AbstractWEBRTC.CREATED_PEER, peer);
            }
            peer.handleMessage(message);
        }
    };
}
