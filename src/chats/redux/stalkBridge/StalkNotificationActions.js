/**
 *  NotificationManager
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../BackendFactory");
const CryptoHelper = require("../../utils/CryptoHelper");
const Message_1 = require("../../../libs/shared/Message");
const configureStore_1 = require("../../../redux/configureStore");
exports.STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: exports.STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
exports.regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory_1.BackendFactory.getInstance().dataListener.addOnChatListener(exports.notify);
};
exports.unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory_1.BackendFactory.getInstance().dataListener.removeOnChatListener(exports.notify);
};
exports.notify = (messageImp) => {
    let message = "";
    if (messageImp.type === Message_1.MessageType[Message_1.MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message = decoded.body;
            configureStore_1.default.dispatch(stalkNotiNewMessage(message));
        });
    }
    else if (messageImp.type === Message_1.MessageType[Message_1.MessageType.Location]) {
        message = "Sent you location";
        configureStore_1.default.dispatch(stalkNotiNewMessage(message));
    }
    else if (messageImp.type === Message_1.MessageType[Message_1.MessageType.Image]) {
        message = "Sent you image";
        configureStore_1.default.dispatch(stalkNotiNewMessage(message));
    }
};
