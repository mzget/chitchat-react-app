import { createAction } from "redux-actions";
import { ChitChatFactory } from "../../chats/";
const getStore = () => ChitChatFactory.getInstance().store;
export const ON_VIDEOCALL_INCOMMING = "ON_VIDEOCALL_INCOMMING";
// export const WEBRTC_CREATE_FAILURE = "WEBRTC_CREATE_FAILURE";
const videoCallIncoming = createAction(ON_VIDEOCALL_INCOMMING, payload => payload);
export function onVideoCall(payload) {
    getStore().dispatch(videoCallIncoming(payload));
}
