/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { BackendFactory } from "../../BackendFactory";
import * as StalkNotificationAction from "./StalkNotificationActions";
import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import * as StalkPushActions from "./stalkPushActions";

import { IDictionary } from "../../../libs/stalk/serverImplemented";
import { StalkAccount, RoomAccessData } from "../../../libs/shared/Stalk";

import { ChitChatFactory } from "../../chitchatFactory";
const getStore = () => ChitChatFactory.getInstance().store;

export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    return getStore().getState().stalkReducer.stalkToken;
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

export function stalkLogin(user: any) {
    if (getStore().getState().stalkReducer.isInit) return;

    getStore().dispatch({ type: STALK_INIT });

    const backendFactory = BackendFactory.createInstance();

    let account = {} as StalkAccount;
    account._id = user._id;
    account.username = user.username;
    backendFactory.dataManager.setProfile(account).then(profile => {
        ChatLogsActions.initChatsLog();
    });
    backendFactory.dataManager.addContactInfoFailEvents(onGetContactProfileFail);
    backendFactory.stalkInit().then(value => {
        console.log("StalkInit Value.", value);

        backendFactory.checkIn(user._id, null, user).then(value => {
            let result: { success: boolean, token: any } = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                console.log("Joined chat-server success", result);
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                stalkManageConnection();

                StalkNotificationAction.regisNotifyNewMessageEvent();
                StalkPushActions.stalkPushInit();

                getStore().dispatch({ type: STALK_INIT_SUCCESS, payload: { token: result.token, user: account } });
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
async function stalkManageConnection() {
    const backendFactory = BackendFactory.getInstance();

    let server = await backendFactory.getServer();
    server.onSocketReconnect = (data) => {
        getStore().dispatch(onStalkSocketReconnect(data.type));
    };
    server.onSocketClose = (data) => {
        getStore().dispatch(onStalkSocketClose(data.type));
    };
    server.onDisconnected = (data) => {
        getStore().dispatch(onStalkSocketDisconnected(data.type));
    };
}

export async function stalkLogout() {
    const backendFactory = BackendFactory.getInstance();

    let server = await backendFactory.getServer();
    if (server) {
        server.logout();
    }
}