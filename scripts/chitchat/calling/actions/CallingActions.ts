import { Store } from "redux";
import { createAction } from "redux-actions";

import InternalStore from "stalk-simplechat";
const getStore = () => InternalStore.store as Store<any>;

export const VOIP_CALL_INCOMMING = "VOIP_CALL_INCOMMING";
const voipCallIncoming = createAction(VOIP_CALL_INCOMMING, (payload) => payload);
export function onVOIPCall(data: { event, payload }) {
    getStore().dispatch(voipCallIncoming(data));
}

export function onHangupCall(payload: { user_id: string }) {
    getStore().dispatch(onVideoCallEnded());
}

export const ON_VIDEOCALL_ENDED = "ON_VIDEOCALL_ENDED";
export const onVideoCallEnded = createAction(ON_VIDEOCALL_ENDED);

export const ON_CALLING = "ON_CALLING";
export const onCalling = createAction(ON_CALLING, (room_id) => room_id);
