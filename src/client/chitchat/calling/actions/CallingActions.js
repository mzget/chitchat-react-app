import { createAction } from "redux-actions";
import { ChitChatFactory } from "../../chats/";
const getStore = () => ChitChatFactory.getInstance().store;
export const VOIP_CALL_INCOMMING = "VOIP_CALL_INCOMMING";
const voipCallIncoming = createAction(VOIP_CALL_INCOMMING, payload => payload);
export function onVOIPCall(data) {
    getStore().dispatch(voipCallIncoming(data));
}
export function onHangupCall(payload) {
    getStore().dispatch(onVideoCallEnded());
}
;
export const ON_VIDEOCALL_ENDED = "ON_VIDEOCALL_ENDED";
export const onVideoCallEnded = createAction(ON_VIDEOCALL_ENDED);
export const ON_CALLING = "ON_CALLING";
export const onCalling = createAction(ON_CALLING, room_id => room_id);
