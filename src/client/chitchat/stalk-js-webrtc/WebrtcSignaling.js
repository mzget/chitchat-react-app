export function withExchange(webrtcObject) {
    return function exchange(message) {
        let self = webrtcObject;
        const fromId = message.from;
        let peer = self.peerManager.getPeers(fromId);
        if (!peer) {
            peer = self.peerManager.createPeer({
                id: message.from,
                offer: false,
            }, self);
        }
        peer.handleMessage(message);
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
