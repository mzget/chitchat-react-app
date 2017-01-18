/**
 *  NotificationManager
 * 
 * Copyright 2016 Ahoo Studio.co.th.
 * 
 * The NotificationManager for react.js.
 *
 */


import BackendFactory from "../../chats/BackendFactory";
import { IMessage, ContentType } from "../../chats/models/ChatDataModels";
import { MessageImp } from "../../chats/models/MessageImp";
import * as DecryptionHelper from '../../chats/utils/DecryptionHelper';


import Store from "../configureStore";


export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });

const init = (onSuccess: (err, deviceToken) => void) => {
    console.log("Initialize NotificationManager.");
}

export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");

    BackendFactory.getInstance().dataListener.addNoticeNewMessageEvent(notify);
}

export const unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory.getInstance().dataListener.removeNoticeNewMessageEvent(notify);
}

export const notify = (messageImp: IMessage) => {
    console.log("notify", messageImp);

    DecryptionHelper.decryptionText(messageImp as MessageImp).then(decoded => {
        let message = decoded.body;
        if (messageImp.type == ContentType[ContentType.Location]) {
            message = "Sent you location";
        }
        else if (messageImp.type == ContentType[ContentType.Image]) {
            message = "Sent you image";
        }

        Store.dispatch(stalkNotiNewMessage(message));
    });
}