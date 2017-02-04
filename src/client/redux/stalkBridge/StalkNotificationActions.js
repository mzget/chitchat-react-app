/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const ChatDataModels_1 = require("../../chats/models/ChatDataModels");
const CryptoHelper = require("../../chats/utils/CryptoHelper");
const configureStore_1 = require("../configureStore");
exports.STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: exports.STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
exports.regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory_1.default.getInstance().dataListener.addOnChatListener(exports.notify);
};
exports.unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory_1.default.getInstance().dataListener.removeOnChatListener(exports.notify);
};
exports.notify = (messageImp) => {
    let message = "";
    if (messageImp.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message = decoded.body;
            configureStore_1.default.dispatch(stalkNotiNewMessage(message));
        });
    }
    else if (messageImp.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
        message = "Sent you location";
        configureStore_1.default.dispatch(stalkNotiNewMessage(message));
    }
    else if (messageImp.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]) {
        message = "Sent you image";
        configureStore_1.default.dispatch(stalkNotiNewMessage(message));
    }
};
