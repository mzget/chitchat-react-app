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
        else {
            peer.handleMessage(message);
        }
    };
}
export function withSendMessage(webrtcObject) {
    return function send(messageType, payload, optional) {
        let self = webrtcObject;
        if (!self.signalingSocket)
            return;
        let message = {
            to: optional.to,
            type: messageType,
            payload: payload,
        };
        self.signalingSocket.emit('message', message);
    };
}
