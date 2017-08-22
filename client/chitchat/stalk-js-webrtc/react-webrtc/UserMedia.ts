import adapter from 'webrtc-adapter';
import { AbstractMediaStream } from "../index";
import { AudioController } from '../libs/AudioController';

export class UserMedia implements AbstractMediaStream.IUserMedia {
    debug: boolean = false;
    private localStream: MediaStream;
    public getLocalStream() {
        return this.localStream;
    }
    public getVideoTrackName() {
        let videoTracks = this.localStream.getVideoTracks();
        if (videoTracks.length > 0) {
            // console.log('Using video device: ' + videoTracks[0].label);
            return videoTracks[0].label;
        }

        return "";
    }
    public getAudioTrackName() {
        let audioTracks = this.localStream.getAudioTracks();
        if (audioTracks.length > 0) {
            // console.log('Using audio device: ' + audioTracks[0].label);
            // return audioTracks[0].label;
            return this.audioController.audioSource.label;
        }

        return "";
    }

    audioController: AudioController;

    constructor(options: { debug: boolean }) {
        this.debug = options.debug;
    }

    async  startLocalStream(mediaConstraints: MediaStreamConstraints) {
        let self = this;
        return new Promise((resolve: (stream: MediaStream) => void, reject) => {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(function (stream) {
                stream.oninactive = function () {
                    if (self.debug)
                        console.log('Stream inactive');
                };
                stream.onactive = () => {
                    if (self.debug)
                        console.log('Local Stream active');
                };

                if (stream.getAudioTracks().length > 0) {
                    self.audioController = new AudioController(stream);
                }
                self.localStream = stream as MediaStream;

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

    private stopStream() {
        let self = this;

        if (!!this.localStream) {
            let tracks = this.localStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
        }

        if (!!this.audioController) {
            this.audioController.removeAudioStream();
        }
    }
}