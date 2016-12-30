/**
 *  NotificationManager.ts
 * 
 * Copyright 2016 Ahoo Studio.co.th.
 * 
 * The NotificationManager for react.js.
 *
 */


import BackendFactory from "./BackendFactory";
import { IMessage } from "./models/ChatDataModels";

export default class NotificationManager {
    private static instance: NotificationManager;
    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }

        return NotificationManager.instance;
    }

    init(onSuccess: (err, deviceToken) => void) {
        console.log("Initialize NotificationManager.");
    }

    regisNotifyNewMessageEvent() {
        console.log("subscribe global notify message event");

        BackendFactory.getInstance().dataListener.addNoticeNewMessageEvent(this.notify);
    }

    unsubscribeGlobalNotifyMessageEvent() {
        BackendFactory.getInstance().dataListener.removeNoticeNewMessageEvent(this.notify);
    }

    notify(messageImp: IMessage) {
        console.log("notify", messageImp);
    }
}