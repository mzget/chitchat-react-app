var support = require('webrtcsupport');
import AudioCtx from './audioCtx';
class GainController {
    constructor(stream) {
        this.support = support.webAudio && support.mediaStream;
        this.gain = 1;
        if (this.support) {
            var context = this.context = AudioCtx.getInstance();
            this.microphone = context.createMediaStreamSource(stream);
            this.gainFilter = context.createGain();
            this.destination = context.createMediaStreamDestination();
            this.outputStream = this.destination.stream;
            this.microphone.connect(this.gainFilter);
            this.gainFilter.connect(this.destination);
            this.outputMic = this.outputStream.getAudioTracks()[0];
        }
    }
    setGain(val) {
        if (!this.support)
            return;
        this.gainFilter.gain.value = val;
        this.gain = val;
    }
    getGain() {
        return this.gain;
    }
    off() {
        this.setGain(0);
    }
    on() {
        this.setGain(1);
    }
}
export default GainController;
