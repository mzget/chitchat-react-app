/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BackendFactory } from "../../BackendFactory";
import * as StalkNotificationAction from "./StalkNotificationActions";
import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import { stalkPushInit, stalkCallingInit } from "./";
import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store;
export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    return getStore().getState().stalkReducer.stalkToken;
};
const onGetContactProfileFail = (contact_id) => { };
export const STALK_INIT = "STALK_INIT";
export const STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export const STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
export function stalkLogin(user) {
    if (getStore().getState().stalkReducer.isInit)
        return;
    getStore().dispatch({ type: STALK_INIT });
    const backendFactory = BackendFactory.createInstance();
    let account = {};
    account._id = user._id;
    account.username = user.username;
    backendFactory.dataManager.setProfile(account).then(profile => {
        ChatLogsActions.initChatsLog();
    });
    backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
    backendFactory.stalkInit().then(socket => {
        backendFactory.handshake(user._id).then((connector) => {
            backendFactory.checkIn(user).then((value) => {
                console.log("Joined stalk-service success", value);
                let result = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    stalkManageConnection().then(function (server) {
                        server.listenSocketEvents();
                        backendFactory.getServerListener();
                        backendFactory.subscriptions();
                        StalkNotificationAction.initNativeNotiAPI();
                        StalkNotificationAction.regisNotifyNewMessageEvent();
                        stalkPushInit();
                        stalkCallingInit();
                        getStore().dispatch({ type: STALK_INIT_SUCCESS, payload: { token: result.token, user: account } });
                    }).catch(err => {
                        console.warn("Stalk subscription fail: ", err);
                        getStore().dispatch({ type: STALK_INIT_FAILURE, payload: err });
                    });
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                    getStore().dispatch({ type: STALK_INIT_FAILURE });
                }
            }).catch(err => {
                console.warn("Cannot checkIn", err);
                getStore().dispatch({ type: STALK_INIT_FAILURE });
            });
        }).catch(err => {
            console.warn("Hanshake fail: ", err);
            getStore().dispatch({ type: STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.log("StalkInit Fail.", err);
        getStore().dispatch({ type: STALK_INIT_FAILURE });
    });
}
export const STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export const STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export const STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
export const STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
const onStalkSocketReconnect = (data) => ({ type: STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data) => ({ type: STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data) => ({ type: STALK_ON_SOCKET_DISCONNECTED, payload: data });
function stalkManageConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory.getInstance();
        let server = backendFactory.getServer();
        server.onSocketReconnect = (data) => {
            getStore().dispatch(onStalkSocketReconnect(data.type));
        };
        server.onSocketClose = (data) => {
            getStore().dispatch(onStalkSocketClose(data.type));
        };
        server.onDisconnected = (data) => {
            getStore().dispatch(onStalkSocketDisconnected(data.type));
        };
        return yield server;
    });
}
export function stalkLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory.getInstance();
        return yield backendFactory.logout();
    });
}
