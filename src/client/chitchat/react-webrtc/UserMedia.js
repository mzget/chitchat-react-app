var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MicController } from '../libs/MicController';
export class UserMedia {
    getLocalStream() {
        return this.localStream;
    }
    constructor() {
    }
    startLocalStream(mediaConstraints) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
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
                    self.localStream = stream;
                    self.micController = new MicController(stream);
                    resolve(self.localStream);
                }, error => {
                    if (error.name === 'ConstraintNotSatisfiedError') {
                        reject('The resolution  is not supported by your device.');
                    }
                    else if (error.name === 'PermissionDeniedError') {
                        reject('Permissions have not been granted to use your camera and ' +
                            'microphone, you need to allow the page access to your devices in ' +
                            'order for the demo to work.');
                    }
                    else {
                        reject('getUserMedia error: ' + error.name);
                    }
                });
            });
        });
    }
    stopLocalStream() {
        this.stopStream();
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
