import SimpleWebRTC from 'simplewebrtc';

export namespace WEBRTC {
    export class WebRtcFactory {
        private static webrtcInstance;
        public static getInstance() {
            return WebRtcFactory.webrtcInstance;
        }
        public static createInstance(init: IWebRtc) {
            if (!WebRtcFactory.webrtcInstance) {
                WebRtcFactory.webrtcInstance = new WebRtc(init);
                return WebRtcFactory.webrtcInstance;
            }
            else {
                throw new Error("Can't create new instance!");
            }
        }
    }

    export interface IWebRtc {
        localVideoEl: string;
        remoteVideosEl: string;
        signalingServer: string;
    }
    export class WebRtc {
        constructor(opts: IWebRtc) {
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
}