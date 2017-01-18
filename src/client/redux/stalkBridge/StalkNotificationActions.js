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
const DecryptionHelper = require("../../chats/utils/DecryptionHelper");
const configureStore_1 = require("../configureStore");
exports.STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: exports.STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
exports.regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory_1.default.getInstance().dataListener.addNoticeNewMessageEvent(exports.notify);
};
exports.unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory_1.default.getInstance().dataListener.removeNoticeNewMessageEvent(exports.notify);
};
exports.notify = (messageImp) => {
    console.log("notify", messageImp);
    DecryptionHelper.decryptionText(messageImp).then(decoded => {
        let message = decoded.body;
        if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            message = "Sent you location";
        }
        else if (messageImp.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]) {
            message = "Sent you image";
        }
        configureStore_1.default.dispatch(stalkNotiNewMessage(message));
    });
};
