class WebRtcComponent {
    constructor() {
        console.log("starting.. webRtcComponent.");
        this.webRtcCallState = new WebRtcCallState();
    }
    setCallState(state) {
        this.webRtcCallState.callState = state;
    }
    onVideoCall(dataEvent) {
        let body = dataEvent.body;
        let contactId = body.from;
        let peerId = body.peerId;
        if (this.webRtcCallState.callState === CallState.idle) {
            if (this.videoCallEvent != null) {
                this.videoCallEvent(contactId, peerId);
            }
        }
        else {
            console.warn("Call status is not idle. " + this.webRtcCallState.callState.toString());
            if (this.lineBusyEvent != null) {
                this.lineBusyEvent(contactId);
            }
        }
    }
    onVoiceCall(dataEvent) {
        let body = dataEvent.body;
        let contactId = body.from;
        let peerId = body.peerId;
        if (this.webRtcCallState.callState === CallState.idle) {
            if (this.voiceCallEvent != null) {
                this.voiceCallEvent(contactId, peerId);
            }
        }
        else {
            console.warn("Call status is not idle. " + this.webRtcCallState.callState.toString());
            if (this.lineBusyEvent != null) {
                this.lineBusyEvent(contactId);
            }
        }
    }
    onHangupCall(dataEvent) {
        if (this.hangUpCallEvent != null) {
            this.hangUpCallEvent();
        }
    }
    onTheLineIsBusy(dataEvent) {
        if (this.contactLineBusyEvent != null) {
            this.contactLineBusyEvent();
        }
    }
}
