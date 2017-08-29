import { getImage } from './VideoToBlurImage';
export class VideoController {
    constructor(stream) {
        this.localStream = stream;
        this.videoSource = stream.getVideoTracks()[0];
    }
    setVideoEnabled(enabled) {
        if (!!this.videoSource) {
            let localVideoElement = document.getElementById('localVideo');
            if (!!localVideoElement) {
                if (enabled) {
                    localVideoElement.srcObject = this.localStream;
                }
                else {
                    getImage(localVideoElement).then((res) => {
                        localVideoElement.srcObject = res;
                    });
                }
            }
            this.videoSource.enabled = !!enabled;
        }
    }
}
