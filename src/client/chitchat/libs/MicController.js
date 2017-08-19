import AudioCtx from './audioCtx';
export class MicController {
    constructor(stream) {
        this.support = (!!(AudioContext && AudioContext.prototype.createMediaStreamSource)
            &&
                !!(MediaStream && MediaStream.prototype.removeTrack));
        this.volume = 1;
        if (this.support) {
            let context = AudioCtx.getInstance();
            let microphone = context.createMediaStreamSource(stream);
            this.gainFilter = context.createGain();
            let destination = context.createMediaStreamDestination();
            let outputStream = destination.stream;
            microphone.connect(this.gainFilter);
            this.gainFilter.connect(destination);
            stream.addTrack(outputStream.getAudioTracks()[0]);
            this.audioSource = stream.getAudioTracks()[0];
            stream.removeTrack(this.audioSource);
        }
        else {
            console.log("Not support adjust local microphone volume");
        }
    }
    setVolume(volume) {
        if (!this.support)
            return;
        this.gainFilter.gain.value = volume;
        this.volume = volume;
    }
    getVolume() {
        return this.volume;
    }
    mute() {
        this.setVolume(0);
    }
    unMute() {
        this.setVolume(1);
    }
    removeAudioStream() {
        this.audioSource.stop();
    }
}
