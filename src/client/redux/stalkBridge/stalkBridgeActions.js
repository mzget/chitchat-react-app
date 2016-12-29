/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
// import NotificationManager from "../../chats/notificationManager";
const DataModels = require("../../chats/models/ChatDataModels");
const configureStore_1 = require("../configureStore");
const ChatLogsActions = require("../chatlogs/chatlogsActions");
const StalkPushActions = require("./stalkPushActions");
exports.getSessionToken = () => {
    const backendFactory = BackendFactory_1.default.getInstance();
    return backendFactory.dataManager.getSessionToken();
};
exports.getRoomDAL = () => {
    const backendFactory = BackendFactory_1.default.getInstance();
    return backendFactory.dataManager.roomDAL;
};
exports.onStalkLoginSuccess = new Array();
const onGetContactProfileFail = (contact_id) => {
};
function getUserInfo(userId, callback) {
    let self = this;
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    let user = dataManager.getContactProfile(userId);
    callback(user);
}
exports.getUserInfo = getUserInfo;
exports.STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
function stalkLoginWithToken(uid, token) {
    console.log("stalkLoginWithToken", uid, token);
    const backendFactory = BackendFactory_1.default.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(uid, token, null).then(value => {
            console.log("Joined chat-server success", value.code);
            let result = JSON.parse(value.data);
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                // NotificationManager.getInstance().regisNotifyNewMessageEvent();
                let msg = {};
                msg["token"] = token;
                backendFactory.getServer().then(server => {
                    server.getMe(msg, (err, res) => {
                        console.log("MyChat-Profile", res);
                        let account = new DataModels.StalkAccount();
                        account._id = result.decoded._id;
                        account.displayname = result.decoded.email;
                        let data = (!!res.data) ? res.data : account;
                        backendFactory.dataManager.setProfile(data).then(profile => {
                            console.log("set chat profile success", profile);
                            ChatLogsActions.initChatsLog();
                        });
                        backendFactory.dataManager.setSessionToken(token);
                        backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                        StalkPushActions.stalkPushInit();
                    });
                }).catch(err => {
                    console.warn("Chat-server not yet ready");
                });
            }
            else {
                console.warn("Cannot joined chat server.");
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
        });
    }).catch(err => {
        console.warn("StalkInit Fail.");
    });
}
exports.stalkLoginWithToken = stalkLoginWithToken;
function stalkLogin(user) {
    console.log("stalkLogin init status", configureStore_1.default.getState().stalkReducer.isInit);
    if (configureStore_1.default.getState().stalkReducer.isInit)
        return;
    const backendFactory = BackendFactory_1.default.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(user._id, null, user).then(value => {
            console.log("Joined chat-server success", value);
            let result = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                // NotificationManager.getInstance().regisNotifyNewMessageEvent();
                console.log("MyChat-Profile", user);
                let account = new DataModels.StalkAccount();
                account._id = user._id;
                account.displayname = user.username;
                backendFactory.dataManager.setProfile(account).then(profile => {
                    console.log("set chat profile success", profile);
                    ChatLogsActions.initChatsLog();
                });
                backendFactory.dataManager.setSessionToken(result.token);
                backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                StalkPushActions.stalkPushInit();
                if (exports.onStalkLoginSuccess.length > 0)
                    exports.onStalkLoginSuccess.map(item => item());
            }
            else {
                console.warn("Cannot joined chat server.");
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
        });
    }).catch(err => {
        console.warn("StalkInit Fail.");
        configureStore_1.default.dispatch({ type: exports.STALK_INIT_FAILURE });
    });
}
exports.stalkLogin = stalkLogin;
