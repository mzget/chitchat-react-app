import { AbstractPeerConnection } from "./";
export var AbstractPeer;
(function (AbstractPeer) {
    class BasePeer {
        constructor(config) {
            this.enableDataChannels = true;
            this.channels = {};
            this.logError = (error) => {
                console.log(error);
            };
            if (!config.stream) {
                throw new Error("Missing stream!!!");
            }
            this.debug = config.debug;
            this.id = config.peer_id;
            this.pcPeers = config.pcPeers;
            this.parentsEmitter = config.emitter;
            this.send_event = config.sendHandler;
            this.offer = config.offer;
        }
        initPeerConnection(stream) { }
        removeStream(stream) {
            this.pc.removeStream(stream);
        }
        addStream(stream) {
            this.pc.addStream(stream);
        }
        onSetSessionDescriptionError(error) {
            console.warn('Failed to set session description: ' + error.toString());
        }
        onCreateSessionDescriptionError(error) {
            console.warn('Failed to create session description: ' + error.toString());
        }
        createOffer() {
            let self = this;
            this.pc.createOffer(function (desc) {
                if (self.debug)
                    console.log('createOffer Success');
                self.pc.setLocalDescription(desc, function () {
                    if (self.debug)
                        console.log('setLocalDescription Success');
                    self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: self.id });
                }, self.onSetSessionDescriptionError);
            }, self.onCreateSessionDescriptionError);
        }
        createAnswer(message) {
            let self = this;
            self.pc.createAnswer(function (desc) {
                if (self.debug)
                    console.log('createAnswer Success');
                self.pc.setLocalDescription(desc, function () {
                    if (self.debug)
                        console.log('setLocalDescription Success');
                    self.send_event(AbstractPeerConnection.OFFER, self.pc.localDescription, { to: message.from });
                }, self.onSetSessionDescriptionError);
            }, self.onCreateSessionDescriptionError);
        }
    }
    AbstractPeer.BasePeer = BasePeer;
})(AbstractPeer = AbstractPeer || (AbstractPeer = {}));
