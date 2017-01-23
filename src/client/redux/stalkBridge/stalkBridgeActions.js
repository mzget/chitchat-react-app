/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const StalkNotificationAction = require("./StalkNotificationActions");
const DataModels = require("../../chats/models/ChatDataModels");
const ServiceProvider = require("../../chats/services/ServiceProvider");
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
const onGetContactProfileFail = (contact_id) => {
};
function getUserInfo(userId, callback) {
    let self = this;
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    let user = dataManager.getContactProfile(userId);
    callback(user);
}
exports.getUserInfo = getUserInfo;
exports.STALK_INIT = "STALK_INIT";
exports.STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
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
                StalkNotificationAction.regisNotifyNewMessageEvent();
                let msg = {};
                msg["token"] = token;
                backendFactory.getServer().then(server => {
                    server.getMe(msg, (err, res) => {
                        console.log("MyChat-Profile", res);
                        let account = new DataModels.StalkAccount();
                        account._id = result.decoded._id;
                        account.username = result.decoded.email;
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
    configureStore_1.default.dispatch({ type: exports.STALK_INIT });
    const backendFactory = BackendFactory_1.default.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(user._id, null, user).then(value => {
            let result = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                console.log("Joined chat-server success", result);
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                StalkNotificationAction.regisNotifyNewMessageEvent();
                let account = new DataModels.StalkAccount();
                account._id = user._id;
                account.username = user.username;
                backendFactory.dataManager.setProfile(account).then(profile => {
                    console.log("set chat profile success", profile);
                    ChatLogsActions.initChatsLog();
                });
                backendFactory.dataManager.setSessionToken(result.token);
                backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                StalkPushActions.stalkPushInit();
                configureStore_1.default.dispatch({ type: exports.STALK_INIT_SUCCESS });
            }
            else {
                console.warn("Joined chat-server fail: ", result);
                configureStore_1.default.dispatch({ type: exports.STALK_INIT_FAILURE });
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
            configureStore_1.default.dispatch({ type: exports.STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.warn("StalkInit Fail.");
        configureStore_1.default.dispatch({ type: exports.STALK_INIT_FAILURE });
    });
}
exports.stalkLogin = stalkLogin;
const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
const getLastAccessRoomSuccess = (payload) => ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (err) => ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: err });
function getLastAccessRoom() {
    return dispatch => {
        let token = configureStore_1.default.getState().authReducer.token;
        ServiceProvider.getLastAccessRoomInfo(token)
            .then(response => response.json())
            .then(result => {
            if (result.success) {
                dispatch(getLastAccessRoomSuccess(result.result));
                BackendFactory_1.default.getInstance().dataListener.onAccessRoom(result.result);
            }
            else {
                dispatch(getLastAccessRoomFailure(result.message));
            }
        }).catch(err => {
            dispatch(getLastAccessRoomFailure(err));
        });
    };
}
exports.getLastAccessRoom = getLastAccessRoom;
