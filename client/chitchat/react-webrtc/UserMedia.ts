import adapter from 'webrtc-adapter';
import { AbstractMediaStreamModule } from "../stalk-js-webrtc/index";
import { MicController } from '../libs/MicController';

export class UserMedia implements AbstractMediaStreamModule.IUserMedia {
    debug: boolean = false;
    private localStream: MediaStream;
    public getLocalStream() {
        return this.localStream;
    }
    micController: MicController;

    constructor(options: { debug: boolean }) {
        this.debug = options.debug;
    }

    async  startLocalStream(mediaConstraints: MediaStreamConstraints) {
        let self = this;
        return new Promise((resolve: (stream: MediaStream) => void, reject) => {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(function (stream) {
                let videoTracks = stream.getVideoTracks();
                let audioTracks = stream.getAudioTracks();
                if (videoTracks.length > 0) {
                    console.log('Using video device: ' + videoTracks[0].label);
                }
                if (audioTracks.length > 0) {
                    console.log('Using audio device: ' + audioTracks[0].label);
                }

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

    setVideoEnabled(enabled: boolean) {
        if (!!this.localStream) {
            let videoTracks = this.localStream.getVideoTracks();
            if (!!videoTracks && videoTracks.length > 0) {
                videoTracks.forEach(function (track) {
                    track.enabled = !!enabled;
                });
            }
        }
    }

    stopLocalStream() {
        this.stopStream();
        // this.stopScreenShare();
    }

    stopStream() {
        let self = this;

        if (!!this.localStream) {
            let tracks = this.localStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            this.micController.removeAudioStream();
        }
    }
}