/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { CallingEvents } from "stalk-js";
import { BackendFactory } from "../../";
export function stalkCallingInit() {
    const callingDataListener = BackendFactory.getInstance().callingDataListener;
    callingDataListener.addOnCallListener(onCall_handler);
}
function onCall_handler(dataEvent) {
    let call = dataEvent;
    console.log(`onCall_handler :`, call);
    switch (call.event) {
        case CallingEvents.VideoCall:
            break;
        case CallingEvents.VoiceCall:
            break;
        case CallingEvents.HangupCall:
            break;
        case CallingEvents.TheLineIsBusy:
            break;
        default:
            break;
    }
}
