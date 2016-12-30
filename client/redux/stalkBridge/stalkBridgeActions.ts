/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import BackendFactory from "../../chats/BackendFactory";
import NotificationManager from "../../chats/notificationManager";
import * as DataModels from "../../chats/models/ChatDataModels";
import HTTPStatus from "../../libs/stalk/utils/httpStatusCode";
import StalkImp, { IDictionary } from "../../libs/stalk/serverImplemented";

import config from "../../configs/config";
import Store from "../configureStore";

import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import * as StalkPushActions from "./stalkPushActions";

export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    return backendFactory.dataManager.getSessionToken();
}
export const getRoomDAL = () => {
    const backendFactory = BackendFactory.getInstance();
    return backendFactory.dataManager.roomDAL;
}
const onGetContactProfileFail = (contact_id: string) => {

};

export function getUserInfo(userId: string, callback: (user: DataModels.ContactInfo) => void) {
    let self = this;

    let dataManager = BackendFactory.getInstance().dataManager;
    let user: DataModels.ContactInfo = dataManager.getContactProfile(userId);
    callback(user);
}


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

                NotificationManager.getInstance().regisNotifyNewMessageEvent();

                let msg: IDictionary = {};
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

export function stalkLogin(user: any) {
    console.log("stalkLogin init status", Store.getState().stalkReducer.isInit);
    if (Store.getState().stalkReducer.isInit) return;

    Store.dispatch({ type: STALK_INIT });

    const backendFactory = BackendFactory.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(user._id, null, user).then(value => {
            console.log("Joined chat-server success", value);
            let result: { success: boolean, token: any } = JSON.parse(JSON.stringify(value.data));
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();

                NotificationManager.getInstance().regisNotifyNewMessageEvent();

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

                Store.dispatch({ type: STALK_INIT_SUCCESS });
            }
            else {
                console.warn("Cannot joined chat server.");
            }
        }).catch(err => {
            console.warn("Cannot checkIn", err);
        });
    }).catch(err => {
        console.warn("StalkInit Fail.");

        Store.dispatch({ type: STALK_INIT_FAILURE });
    });
}