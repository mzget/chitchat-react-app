/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { CallingEvents } from "stalk-js";
import { BackendFactory } from "../../BackendFactory";
import * as callingActions from "../../../calling/";
export function stalkCallingInit() {
    const callingDataListener = BackendFactory.getInstance().callingDataListener;
    callingDataListener.addOnCallListener(onCall_handler);
}
function onCall_handler(dataEvent) {
    let call = dataEvent;
    console.log(`onCall_handler :`, call);
    if (call.event === CallingEvents.VideoCall || call.event === CallingEvents.VoiceCall) {
        callingActions.onVOIPCall(call);
    }
    else if (call.event === CallingEvents.HangupCall) {
        callingActions.onHangupCall(call.payload);
    }
}
