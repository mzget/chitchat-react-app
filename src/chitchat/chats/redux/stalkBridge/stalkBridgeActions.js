/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("../../BackendFactory");
const StalkNotificationAction = require("./StalkNotificationActions");
const ChatLogsActions = require("../chatlogs/chatlogsActions");
const StalkPushActions = require("./stalkPushActions");
const chitchatFactory_1 = require("../../chitchatFactory");
const getStore = () => chitchatFactory_1.ChitChatFactory.getInstance().store;
exports.getSessionToken = () => {
    const backendFactory = BackendFactory_1.BackendFactory.getInstance();
    return getStore().getState().stalkReducer.stalkToken;
};
exports.getRoomDAL = () => {
    const backendFactory = BackendFactory_1.BackendFactory.getInstance();
    return backendFactory.dataManager.roomDAL;
};
const onGetContactProfileFail = (contact_id) => {
};
exports.STALK_INIT = "STALK_INIT";
exports.STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
exports.STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
function stalkLogin(user) {
    console.log("stalkLogin init status");
    if (getStore().getState().stalkReducer.isInit)
        return;
    getStore().dispatch({ type: exports.STALK_INIT });
    const backendFactory = BackendFactory_1.BackendFactory.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(user._id, null, user).then(value => {
            let result = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                console.log("Joined chat-server success", result);
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                stalkManageConnection();
                StalkNotificationAction.regisNotifyNewMessageEvent();
                let account = {};
                account._id = user._id;
                account.username = user.username;
                backendFactory.dataManager.setProfile(account).then(profile => {
                    console.log("set chat profile success", profile);
                    ChatLogsActions.initChatsLog();
                });
                backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                StalkPushActions.stalkPushInit();
                getStore().dispatch({ type: exports.STALK_INIT_SUCCESS, payload: { token: result.token, user: account } });
            }
            else {
                console.warn("Joined chat-server fail: ", result);
                getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
            getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.warn("StalkInit Fail.", err);
        getStore().dispatch({ type: exports.STALK_INIT_FAILURE });
    });
}
exports.stalkLogin = stalkLogin;
exports.STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
exports.STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
exports.STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
exports.STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
const onStalkSocketReconnect = (data) => ({ type: exports.STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data) => ({ type: exports.STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data) => ({ type: exports.STALK_ON_SOCKET_DISCONNECTED, payload: data });
function stalkManageConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory_1.BackendFactory.getInstance();
        let server = yield backendFactory.getServer();
        server.onSocketReconnect = (data) => {
            getStore().dispatch(onStalkSocketReconnect(data.type));
        };
        server.onSocketClose = (data) => {
            getStore().dispatch(onStalkSocketClose(data.type));
        };
        server.onDisconnected = (data) => {
            getStore().dispatch(onStalkSocketDisconnected(data.type));
        };
    });
}
function stalkLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory_1.BackendFactory.getInstance();
        let server = yield backendFactory.getServer();
        server.logout();
    });
}
exports.stalkLogout = stalkLogout;
