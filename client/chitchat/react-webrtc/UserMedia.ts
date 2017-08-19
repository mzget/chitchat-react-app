navigator.getUserMedia = navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia;

import { MicController } from '../libs/MicController';

export class UserMedia {
    private localStream: MediaStream;
    public getLocalStream() {
        return this.localStream;
    }
    micController: MicController;

    constructor() {

    }

    async  startLocalStream(mediaConstraints: MediaStreamConstraints) {
        let self = this;
        return new Promise((resolve: (stream: MediaStream) => void, reject) => {
            navigator.getUserMedia(mediaConstraints, function (stream) {
                self.localStream = stream as MediaStream;
                self.micController = new MicController(stream);

                resolve(self.localStream);
            }, err => reject(err));
        });
    }

    stopLocalStream() {
        this.stopStream();
        // this.stopScreenShare();
    }

    stopStream() {
        let self = this;

        let tracks = this.localStream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        this.micController.removeAudioStream();
    }
}