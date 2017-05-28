/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { BackendFactory } from "../../BackendFactory";
export function stalkPushInit() {
    const pushDataListener = BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
function onPush_handler(dataEvent) {
    console.log(`Event : ${dataEvent}`);
}
