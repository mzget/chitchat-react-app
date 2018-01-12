/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { CallingEvents } from "stalk-js";
import { CallingDataListener } from "stalk-js/starter";
import * as callingActions from "../../../calling/";
export function stalkCallingInit() {
    const callingDataListener = CallingDataListener.createInstance();
    callingDataListener.addOnCallListener(onCall_handler);
}
function onCall_handler(dataEvent) {
    const call = dataEvent;
    console.log(`onCall_handler :`, call);
    if (call.event === CallingEvents.VideoCall || call.event === CallingEvents.VoiceCall) {
        callingActions.onVOIPCall(call);
    }
    else if (call.event === CallingEvents.HangupCall) {
        callingActions.onHangupCall(call.payload);
    }
}
