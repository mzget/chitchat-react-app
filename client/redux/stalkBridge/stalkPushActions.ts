/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import BackendFactory from "../../chats/BackendFactory";
import Store from "../configureStore";

const LINK_REQUEST = "LINK_REQUEST";
const LINK_ACCEPTED = "LINK_ACCEPTED";
const NEW_NOTICE = 'NEW_NOTICE';

export function stalkPushInit() {
    const pushDataListener = BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}

function onPush_handler(dataEvent) {
    console.log(`Event : ${dataEvent}`);
}