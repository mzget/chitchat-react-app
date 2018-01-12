/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
import { BackendFactory } from "stalk-js/starter";
import InternalStore, { SecureUtils } from "stalk-simplechat";
import { MessageType } from "../../../shared/Message";
import { REACTJS } from "../../../consts/Platform";
import { NotificationAPI as NotiAPI } from "../../../../actions/";
const getStore = () => InternalStore.store;
export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    const backend = BackendFactory.getInstance();
    if (!!backend) {
        backend.dataListener.addOnChatListener(notify);
    }
};
export const unsubscribeGlobalNotifyMessageEvent = () => {
    const backend = BackendFactory.getInstance();
    if (!!backend) {
        backend.dataListener.removeOnChatListener(notify);
    }
};
export const notify = (messageImp) => {
    const message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar,
    };
    if (messageImp.type === MessageType[MessageType.Text]) {
        SecureUtils.CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;
            if (global.userAgent === REACTJS) {
                NotiAPI.NotificationFactory.getInstance().nativeNotifyAPI(message);
            }
            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;
        if (global.userAgent === REACTJS) {
            NotiAPI.NotificationFactory.getInstance().nativeNotifyAPI(message);
        }
        getStore().dispatch(stalkNotiNewMessage(message));
    }
};
export const initNativeNotiAPI = () => {
    if (global.userAgent === REACTJS) {
        NotiAPI.NotificationFactory.createInstance();
    }
};
