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
import { MessageType } from "../../../shared/Message";

import { ChitChatFactory } from "../../ChitchatFactory";

const getStore = () => ChitChatFactory.getInstance().store;

type NotiMessage = { title: string; body: string; image: string; }

export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload: NotiMessage) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });

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
    let message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar
    } as NotiMessage;

    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;
            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;
        getStore().dispatch(stalkNotiNewMessage(message));
    }
};