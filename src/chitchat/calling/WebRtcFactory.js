export var WEBRTC;
(function (WEBRTC) {
    class WebRtcFactory {
        static getInstance() {
            return WebRtcFactory.webrtcInstance;
        }
        static setupInstance(rtc) {
            if (!WebRtcFactory.webrtcInstance) {
                WebRtcFactory.webrtcInstance = rtc;
                return WebRtcFactory.webrtcInstance;
            }
            else {
                throw new Error("Can't create new instance!");
            }
        }
        static dispose() {
            WebRtcFactory.webrtcInstance = null;
        }
    }
    WEBRTC.WebRtcFactory = WebRtcFactory;
    // export class WebRtc {
    //     constructor(opts: IWebRtc) {
    //         let webrtc = new SimpleWebRTC({
    //             localVideoEl: opts.localVideoEl,
    //             remoteVideosEl: opts.remoteVideosEl,
    //             autoRequestMedia: true,
    //             enableDataChannels: false,
    //             url: opts.signalingServer,
    //             debug: true
    //         });
    //         return webrtc;
    //     }
    // }
})(WEBRTC || (WEBRTC = {}));
