/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var BackendFactory_1 = require("../../BackendFactory");
var ChatRoomComponent_1 = require("../../ChatRoomComponent");
function stalkPushInit() {
    var pushDataListener = BackendFactory_1.BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
exports.stalkPushInit = stalkPushInit;
function onPush_handler(dataEvent) {
    var push = dataEvent;
    console.log("onPush_handler :", push);
    if (push.event == "onMessageRead") {
        ChatRoomComponent_1.ChatRoomComponent.getInstance().onMessageRead(push.message);
    }
}
