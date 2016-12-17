var CallState;
(function (CallState) {
    CallState[CallState["idle"] = 0] = "idle";
    CallState[CallState["signalingCall"] = 1] = "signalingCall";
    CallState[CallState["calling"] = 2] = "calling";
})(CallState || (CallState = {}));
;
class WebRtcCallState {
}
