import SimpleWebRTC from 'simplewebrtc';
export var WEBRTC;
(function (WEBRTC) {
    class WebRtcFactory {
        static getInstance() {
            return WebRtcFactory.webrtcInstance;
        }
        static createInstance(init) {
            if (!WebRtcFactory.webrtcInstance) {
                WebRtcFactory.webrtcInstance = new WebRtc(init);
                return WebRtcFactory.webrtcInstance;
            }
            else {
                throw new Error("Can't create new instance!");
            }
        }
    }
    WEBRTC.WebRtcFactory = WebRtcFactory;
    class WebRtc {
        constructor(opts) {
            let webrtc = new SimpleWebRTC({
                localVideoEl: opts.localVideoEl,
                remoteVideosEl: opts.remoteVideosEl,
                autoRequestMedia: true,
                enableDataChannels: false,
                url: opts.signalingServer,
                debug: true
            });
            return webrtc;
        }
    }
    WEBRTC.WebRtc = WebRtc;
})(WEBRTC || (WEBRTC = {}));
