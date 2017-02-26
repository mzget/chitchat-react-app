/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../chats/BackendFactory");
const LINK_REQUEST = "LINK_REQUEST";
const LINK_ACCEPTED = "LINK_ACCEPTED";
const NEW_NOTICE = "NEW_NOTICE";
function stalkPushInit() {
    const pushDataListener = BackendFactory_1.BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
exports.stalkPushInit = stalkPushInit;
function onPush_handler(dataEvent) {
    console.log(`Event : ${dataEvent}`);
}
