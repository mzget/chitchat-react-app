/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var BackendFactory_1 = require("../../BackendFactory");
function stalkPushInit() {
    var pushDataListener = BackendFactory_1.BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
exports.stalkPushInit = stalkPushInit;
function onPush_handler(dataEvent) {
    console.log("Event : " + dataEvent);
}
