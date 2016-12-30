/**
 *  NotificationManager.ts
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
"use strict";
const BackendFactory_1 = require("./BackendFactory");
class NotificationManager {
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    init(onSuccess) {
        console.log("Initialize NotificationManager.");
    }
    regisNotifyNewMessageEvent() {
        console.log("subscribe global notify message event");
        BackendFactory_1.default.getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    }
    unsubscribeGlobalNotifyMessageEvent() {
        BackendFactory_1.default.getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    }
    notify(messageImp) {
        console.log("notify", messageImp);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationManager;
