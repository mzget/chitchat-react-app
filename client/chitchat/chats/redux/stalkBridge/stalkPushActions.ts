/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { BackendFactory } from "../../BackendFactory";

type Push = {
    event: string;
    message: string;
    timestamp: Date;
    members: Array<string>;
};

export function stalkPushInit() {
    const pushDataListener = BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}

function onPush_handler(dataEvent) {
    let push = dataEvent as Push;

    console.log(`onPush_handler :`, push);
}