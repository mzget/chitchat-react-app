/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { BackendFactory } from "../../chats/BackendFactory";
import * as StalkNotificationAction from "./StalkNotificationActions";
import * as DataModels from "../../chats/models/ChatDataModels";
import { IDictionary } from "../../libs/stalk/serverImplemented";

import config from "../../configs/config";
import Store from "../configureStore";

import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import * as StalkPushActions from "./stalkPushActions";

export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    return Store.getState().stalkReducer.stalkToken;
};
export const getRoomDAL = () => {
    const backendFactory = BackendFactory.getInstance();
    return backendFactory.dataManager.roomDAL;
};
const onGetContactProfileFail = (contact_id: string) => {

};

export const STALK_INIT = "STALK_INIT";
export const STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export const STALK_INIT_FAILURE = "STALK_INIT_FAILURE";

export function stalkLoginWithToken(uid: string, token: string) {
    console.log("stalkLoginWithToken", uid, token);

    const backendFactory = BackendFactory.getInstance();

    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(uid, token, null).then(value => {
            console.log("Joined chat-server success", value.code);
            let result: { success: boolean, decoded: any } = JSON.parse(value.data);
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();

                StalkNotificationAction.regisNotifyNewMessageEvent();

                let msg: IDictionary = {};
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

export function stalkLogin(user: any) {
    console.log("stalkLogin init status", Store.getState().stalkReducer.isInit);
    if (Store.getState().stalkReducer.isInit) return;

    Store.dispatch({ type: STALK_INIT });

    const backendFactory = BackendFactory.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(user._id, null, user).then(value => {
            let result: { success: boolean, token: any } = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                console.log("Joined chat-server success", result);
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                stalkManageConnection();

                StalkNotificationAction.regisNotifyNewMessageEvent();

                let account = new DataModels.StalkAccount();
                account._id = user._id;
                account.username = user.username;

                backendFactory.dataManager.setProfile(account).then(profile => {
                    console.log("set chat profile success", profile);
                    ChatLogsActions.initChatsLog();
                });
                backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
                StalkPushActions.stalkPushInit();

                Store.dispatch({ type: STALK_INIT_SUCCESS, payload: result.token });
            }
            else {
                console.warn("Joined chat-server fail: ", result);
                Store.dispatch({ type: STALK_INIT_FAILURE });
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
            Store.dispatch({ type: STALK_INIT_FAILURE });
        });
    }).catch(err => {
        console.warn("StalkInit Fail.", err);

        Store.dispatch({ type: STALK_INIT_FAILURE });
    });
}

export const STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export const STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export const STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
export const STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
const onStalkSocketReconnect = (data) => ({ type: STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data) => ({ type: STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data) => ({ type: STALK_ON_SOCKET_DISCONNECTED, payload: data });
async function stalkManageConnection() {
    const backendFactory = BackendFactory.getInstance();

    let server = await backendFactory.getServer();
    server.onSocketReconnect = (data) => {
        Store.dispatch(onStalkSocketReconnect(data.type));
    };
    server.onSocketClose = (data) => {
        Store.dispatch(onStalkSocketClose(data.type));
    };
    server.onDisconnected = (data) => {
        Store.dispatch(onStalkSocketDisconnected(data.type));
    };
}

export async function stalkLogout() {
    const backendFactory = BackendFactory.getInstance();

    let server = await backendFactory.getServer();
    server.logout();
}