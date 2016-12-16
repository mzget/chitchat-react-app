/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import BackendFactory from "../../chats/BackendFactory";
import NotificationManager from "../../chats/notificationManager";
import * as DataModels from "../../chats/models/ChatDataModels";
import HTTPStatus from "../../libs/stalk/utils/httpStatusCode";
import Store from "../configureStore";
import * as ChatLogsActions from "../chatlogs/chatlogsActions";
import * as StalkPushActions from "./stalkPushActions";
export const STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST = "STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST";
export const STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE = "STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE";
export const STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS = "STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS";
const onGetContactProfileFail = (contact_id) => {
};
export function getUserInfo(userId, callback) {
    let self = this;
    let dataManager = BackendFactory.getInstance().dataManager;
    let user = dataManager.getContactProfile(userId);
    if (!user) {
    }
    else {
        callback(user);
    }
}
export function stalkLogin(uid, token) {
    console.log("stalkLogin", uid, token);
    const backendFactory = BackendFactory.getInstance();
    backendFactory.stalkInit().then(value => {
        backendFactory.checkIn(uid, token).then(value => {
            console.log("Joined chat-server success", value.code);
            let result = JSON.parse(value.data);
            if (result.success) {
                backendFactory.getServerListener();
                backendFactory.startChatServerListener();
                NotificationManager.getInstance().regisNotifyNewMessageEvent();
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
export function getPrivateChatRoomId(contactId) {
    return dispatch => {
        let profile = Store.getState().profileReducer.form.profile;
        let token = Store.getState().authReducer.token;
        dispatch({ type: STALK_GET_PRIVATE_CHAT_ROOM_ID_REQUEST });
        BackendFactory.getInstance().getServer().then(server => {
            server.getPrivateChatRoomId(token, profile._id, contactId, function result(err, res) {
                if (res.code === HTTPStatus.success) {
                    let room = JSON.parse(JSON.stringify(res.data));
                    dispatch({ type: STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS, payload: room });
                }
                else {
                    console.warn(err, res);
                    dispatch({ type: STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
                }
            });
        }).catch(err => {
            dispatch({ type: STALK_GET_PRIVATE_CHAT_ROOM_ID_FAILURE, payload: err });
        });
    };
}
