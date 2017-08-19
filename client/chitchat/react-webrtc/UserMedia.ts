import adapter from 'webrtc-adapter';

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
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(function (stream) {
                let videoTracks = stream.getVideoTracks();
                console.log('Using video device: ' + videoTracks[0].label);
                stream.oninactive = function () {
                    console.log('Stream inactive');
                };
                stream.onactive = () => {
                    console.log('Local Stream active');
                };

                self.localStream = stream as MediaStream;
                self.micController = new MicController(stream);

                resolve(self.localStream);
            }, error => {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    reject('The resolution  is not supported by your device.');
                } else if (error.name === 'PermissionDeniedError') {
                    reject('Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.');
                }
                else {
                    reject('getUserMedia error: ' + error.name);
                }
            });
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