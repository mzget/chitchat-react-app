class AudioCtx {
    private static instance: AudioCtx;
    public static getInstance(): AudioCtx {
        if (AudioCtx.instance === null || AudioCtx.instance === undefined) {
            AudioCtx.instance = new (window.AudioContext || window.webkitAudioContext)();
        }

        return AudioCtx.instance;
    }
}

export default AudioCtx;