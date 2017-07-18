import { Store } from "redux";
import { createAction } from "redux-actions";

import { WEBRTC } from "../";
import { ChitChatFactory } from "../../chats/";

const getStore = () => ChitChatFactory.getInstance().store as Store<any>;

export const WEBRTC_CREATED = "WEBRTC_CREATED";
export const WEBRTC_CREATE_FAILURE = "WEBRTC_CREATE_FAILURE";
const webrtcCreated = createAction(WEBRTC_CREATED, payload => payload);
const webrtcCreateFailure = createAction(WEBRTC_CREATE_FAILURE, error => error);
export function createWebRtc(params: any) {
    return dispatch => {
        const webrtc = WEBRTC.WebRtcFactory.createInstance(params);
        if (webrtc) {
            return dispatch(webrtcCreated(webrtc));
        }
        else {
            return dispatch(webrtcCreateFailure(webrtc));
        }
    }
}

export function saveWebRtcState(webrtc: any) {
    return dispatch => {
        if (webrtc) {
            return dispatch(webrtcCreated(webrtc));
        }
        else {
            return dispatch(webrtcCreateFailure(webrtc));
        }
    }
}

export const ON_VIDEOCALL_INCOMMING = "ON_VIDEOCALL_INCOMMING";
// export const WEBRTC_CREATE_FAILURE = "WEBRTC_CREATE_FAILURE";
const videoCallIncoming = createAction(ON_VIDEOCALL_INCOMMING, payload => payload);
export function onVideoCall(payload: any) {
    getStore().dispatch(videoCallIncoming(payload));
}