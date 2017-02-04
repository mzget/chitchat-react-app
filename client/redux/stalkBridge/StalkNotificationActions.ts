/**
 *  NotificationManager
 * 
 * Copyright 2016 Ahoo Studio.co.th.
 * 
 * The NotificationManager for react.js.
 *
 */


import BackendFactory from "../../chats/BackendFactory";
import { ContentType } from "../../chats/models/ChatDataModels";
import { MessageImp } from "../../chats/models/MessageImp";
import * as CryptoHelper from '../../chats/utils/CryptoHelper';


import Store from "../configureStore";


export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });

const init = (onSuccess: (err, deviceToken) => void) => {
    console.log("Initialize NotificationManager.");
};

export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");

    BackendFactory.getInstance().dataListener.addOnChatListener(notify);
};

export const unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory.getInstance().dataListener.removeOnChatListener(notify);
};

export const notify = (messageImp: MessageImp) => {
    let message = "";
    if (messageImp.type === ContentType[ContentType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message = decoded.body;
            Store.dispatch(stalkNotiNewMessage(message));
        });
    }
    else if (messageImp.type === ContentType[ContentType.Location]) {
        message = "Sent you location";
        Store.dispatch(stalkNotiNewMessage(message));
    }
    else if (messageImp.type === ContentType[ContentType.Image]) {
        message = "Sent you image";
        Store.dispatch(stalkNotiNewMessage(message));
    }
};