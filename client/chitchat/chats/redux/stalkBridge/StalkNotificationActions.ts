﻿/**
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

import { REACTJS, REACT_NATIVE } from "../../../consts/Platform";
import { NotificationAPI as NotiAPI } from "../../../../actions/";
import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store;

export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload: NotiAPI.NotiMessage) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });

const init = (onSuccess: (err, deviceToken) => void) => {
    console.log("Initialize NotificationManager.");
};

export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");

    let backend = BackendFactory.getInstance();
    if (!!backend) backend.dataListener.addOnChatListener(notify);
};

export const unsubscribeGlobalNotifyMessageEvent = () => {
    let backend = BackendFactory.getInstance();
    if (!!backend) backend.dataListener.removeOnChatListener(notify);
};

export const notify = (messageImp: MessageImp) => {
    let message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar
    } as NotiAPI.NotiMessage;

    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;

            if (global["userAgent"] == REACTJS)
                NotiAPI.NotificationFactory.getInstance().nativeNotifyAPI(message);

            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;

        if (global["userAgent"] == REACTJS)
            NotiAPI.NotificationFactory.getInstance().nativeNotifyAPI(message);

        getStore().dispatch(stalkNotiNewMessage(message));
    }
};

export const initNativeNotiAPI = () => {
    if (global["userAgent"] == REACTJS)
        NotiAPI.NotificationFactory.createInstance();
} 