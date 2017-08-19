navigator.getUserMedia = navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia;

export class UserMedia {
    private localStream: MediaStream;
    public getLocalStream() {
        return this.localStream;
    }

    constructor() {

    }

    async  startLocalStream(mediaConstraints: MediaStreamConstraints) {
        let self = this;
        return new Promise((resolve: (stream: MediaStream) => void, reject) => {
            navigator.getUserMedia(mediaConstraints, function (stream) {
                self.localStream = stream as MediaStream;

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
    }
}