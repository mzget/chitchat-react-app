import { createAction } from "redux-actions";
import { ChitChatFactory } from "../../chats/";
const getStore = () => ChitChatFactory.getInstance().store;
export const ON_VIDEOCALL_INCOMMING = "ON_VIDEOCALL_INCOMMING";
const videoCallIncoming = createAction(ON_VIDEOCALL_INCOMMING, payload => payload);
export function onVideoCall(payload) {
    getStore().dispatch(videoCallIncoming(payload));
}
export function onHangupCall(payload) {
    getStore().dispatch(onVideoCallEnded());
}
;
export const ON_VIDEOCALL_ENDED = "ON_VIDEOCALL_ENDED";
export const onVideoCallEnded = createAction(ON_VIDEOCALL_ENDED);
export const ON_CALLING = "ON_CALLING";
export const onCalling = createAction(ON_CALLING, room_id => room_id);