/**
 * WebRtcSiggnalling.
 *
 * Copyright 2017 Ahoo Studio.co.th.
 */

import { IWebRTC, STALKWEBRTC } from "./index";

export function withExchange(webrtcObject: IWebRTC) {
    return function exchange(message) {
        let self = webrtcObject;
        const fromId = message.from;
        const roomType = message.roomType;
        let peer = self.peerManager.getPeers(fromId);

        if (message.type === 'offer') {
            if (!peer) {
                peer = self.peerManager.createPeer({
                    id: message.from,
                    // sid: message.sid,
                    type: message.roomType,
                    offer: false,
                    // enableDataChannels: self.config.enableDataChannels && message.roomType !== 'screen',
                    // sharemyscreen: message.roomType === 'screen' && !message.broadcaster,
                    // broadcaster: message.roomType === 'screen' && !message.broadcaster ? self.connection.getSessionid() : null
                }, self);
                self.webrtcEvents.emit(STALKWEBRTC.CREATED_PEER, peer);
            }

            peer.handleMessage(message);
        }
    }
}
