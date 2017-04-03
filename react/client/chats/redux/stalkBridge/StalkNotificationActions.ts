/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */

import { BackendFactory } from "../../BackendFactory";
import { MessageImp } from "../../models/MessageImp";
import * as CryptoHelper from "../../utils/CryptoHelper";
import { MessageType } from "../../../libs/shared/Message";

import Store from "../../../redux/configureStore";

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
    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message = decoded.body;
            Store.dispatch(stalkNotiNewMessage(message));
        });
    }
    else if (messageImp.type === MessageType[MessageType.Location]) {
        message = "Sent you location";
        Store.dispatch(stalkNotiNewMessage(message));
    }
    else if (messageImp.type === MessageType[MessageType.Image]) {
        message = "Sent you image";
        Store.dispatch(stalkNotiNewMessage(message));
    }
};