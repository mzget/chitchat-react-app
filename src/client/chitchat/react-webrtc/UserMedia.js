var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia;
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
                navigator.getUserMedia(mediaConstraints, function (stream) {
                    self.localStream = stream;
                    self.micController = new MicController(stream);
                    resolve(self.localStream);
                }, err => reject(err));
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
