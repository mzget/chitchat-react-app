﻿/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as ServiceProvider from "../../services/ServiceProvider";
import ChatRoomComponent from "../../chatRoomComponent";
import { BackendFactory } from "../../BackendFactory";
import SecureServiceFactory from "../../secure/secureServiceFactory";

import * as NotificationManager from "../stalkBridge/StalkNotificationActions";
import ServerEventListener from "../../../libs/stalk/serverEventListener";
import HTTPStatus from "../../../libs/stalk/utils/httpStatusCode";

import { updateLastAccessRoom } from "../chatlogs/chatlogsActions";

import { Room, RoomType, IMember } from "../../../libs/shared/Room";
import { MessageType, IMessage } from "../../../libs/shared/Message";
import { MemberImp } from "../../models/MemberImp";

import config from "../../../configs/config";
import Store from "../../../redux/configureStore";

import { createAction } from "redux-actions";

const secure = SecureServiceFactory.getService();

/**
 * ChatRoomActionsType
 */
export class ChatRoomActionsType {

    static GET_PERSISTEND_MESSAGE_REQUEST = "GET_PERSISTEND_MESSAGE_REQUEST";
    static GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
    static GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";

    static GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
    static GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";

    static SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
    static SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
    static SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";

    static REPLACE_MESSAGE = "REPLACE_MESSAGE";
    static ON_NEW_MESSAGE = "ON_NEW_MESSAGE";
    static ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
    static LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
}

export const CHATROOM_REDUCER_EMPTY_STATE = "CHATROOM_REDUCER_EMPTY_STATE";
export const emptyState = () => ({ type: CHATROOM_REDUCER_EMPTY_STATE });

export function initChatRoom(currentRoom: Room) {
    if (!currentRoom) throw new Error("Empty roomInfo");

    let room_name = currentRoom.name;
    if (!room_name && currentRoom.type === RoomType.privateChat) {
        currentRoom.members.some((v, id, arr) => {
            if (v._id !== Store.getState().userReducer.user._id) {
                currentRoom.name = v.username;
                return true;
            }
        });
    }

    let chatroomComp = ChatRoomComponent.getInstance();
    chatroomComp.setRoomId(currentRoom._id);

    NotificationManager.unsubscribeGlobalNotifyMessageEvent();

    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}

function onChatRoomDelegate(event, newMsg: IMessage) {
    if (event === ServerEventListener.ON_CHAT) {
        console.log("onChatRoomDelegate: ", ServerEventListener.ON_CHAT, newMsg);
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (BackendFactory.getInstance().dataManager.isMySelf(newMsg.sender)) {
            // dispatch(replaceMyMessage(newMsg));
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            let device = Store.getState().deviceReducer;
            console.warn("AppState: ", device.appState); // active, background, inactive
            if (device.appState === "active") {
                BackendFactory.getInstance().getChatApi().updateMessageReader(newMsg._id, newMsg.rid);
            }
            else if (device.appState !== "active") {
                // @ When user joined room but appState is inActive.
                // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                console.warn("Call local notification here...");
            }

            Store.dispatch(onNewMessage(newMsg));
        }
    }
    else if (event === ServerEventListener.ON_MESSAGE_READ) {
        console.log("serviceListener: ", ServerEventListener.ON_MESSAGE_READ, newMsg);
        //                service.set(chatRoomComponent.chatMessages);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === ServerEventListener.ON_CHAT) {
        console.log("Call notification here...", data); // active, background, inactive
        NotificationManager.notify(data);
    }
}

const onNewMessage = (message: IMessage) => ({ type: ChatRoomActionsType.ON_NEW_MESSAGE, payload: message });

function getPersistendMessage_request() { return { type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_REQUEST }; }
function getPersistendMessage_success(data?: any) {
    return {
        type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS,
        payload: data
    };
}
const getPersistendMessage_failure = () => ({ type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_FAILURE });
export function getPersistendMessage(currentRid: string) {
    return (dispatch) => {
        dispatch(getPersistendMessage_request());

        ChatRoomComponent.getInstance().getPersistentMessage(currentRid).then(function (messages) {
            console.log("getPersistendMessage of room %s: completed.", currentRid);

            dispatch(getPersistendMessage_success());
        }).catch(err => dispatch(getPersistendMessage_failure()));

        // @ Next call 2 method below. -->
        // getNewerMessageFromNet();
        // checkOlderMessages();
    };
}

const onEarlyMessageReady = createAction(ChatRoomActionsType.ON_EARLY_MESSAGE_READY, (data: boolean) => data);
export function checkOlderMessages() {
    return dispatch => {
        let token = Store.getState().authReducer.token;
        let room = Store.getState().chatroomReducer.room;

        ChatRoomComponent.getInstance().getTopEdgeMessageTime(function done(err, res) {
            ServiceProvider.checkOlderMessagesCount(room._id, res, token).then(response => response.json()).then(result => {
                console.log("checkOlderMessagesCount", result);
                if (result.success && result.result > 0) {
                    //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(true));
                }
                else {
                    //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(false));
                }
            }).catch(err => {
                dispatch(onEarlyMessageReady(false));
            });
        });
    };
}

function getNewerMessage_failure() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success(messages: any) {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS, payload: messages };
}
export function getNewerMessageFromNet() {
    return dispatch => {
        let token = Store.getState().authReducer.token;
        ChatRoomComponent.getInstance().getNewerMessageRecord(token, (results) => {
            dispatch(getNewerMessage_success(results));
            // @Todo next joinroom function is ready to call.
        }).catch(err => {
            dispatch(getNewerMessage_failure());
        });
    };
}

export async function getMessages() {
    let chatroomComp = ChatRoomComponent.getInstance();
    let messages = await chatroomComp.getMessages();

    return messages;
}

const send_message_request = () => ({ type: ChatRoomActionsType.SEND_MESSAGE_REQUEST });
const send_message_success = (data: any) => ({ type: ChatRoomActionsType.SEND_MESSAGE_SUCCESS, payload: data });
const send_message_failure = (error?: any) => ({ type: ChatRoomActionsType.SEND_MESSAGE_FAILURE, payload: error });
export function sendMessage(msg: IMessage) {
    return (dispatch) => {
        dispatch(send_message_request());

        if (msg.type === MessageType[MessageType.Location]) {
            BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }

        if (msg.type === MessageType[MessageType.Text] && config.appConfig.encryption === true) {
            secure.encryption(msg.body).then(result => {
                msg.body = result;
                BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                    dispatch(sendMessageResponse(err, res));
                });
            }).catch(err => {
                console.error(err);
                dispatch(send_message_failure(err));
            });
        }
        else {
            BackendFactory.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}

function sendMessageResponse(err, res) {
    return dispatch => {
        if (!!err) {
            dispatch(send_message_failure(err.message));
        }
        else {
            console.log("server response!", res);

            if (res.code == HTTPStatus.success && res.data.hasOwnProperty("resultMsg")) {
                let _msg = { ...res.data.resultMsg } as IMessage;
                if (_msg.type === MessageType[MessageType.Text] && config.appConfig.encryption) {
                    secure.decryption(_msg.body).then(res => {
                        _msg.body = res;
                        dispatch(send_message_success(_msg));
                    }).catch(err => {
                        console.error(err);
                        _msg.body = err.toString();
                        dispatch(send_message_success(_msg));
                    });
                }
                else {
                    dispatch(send_message_success(_msg));
                }
            }
            else {
                dispatch(send_message_failure(res.message));
            }
        }
    };
}

const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export const JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
const joinRoom_request = () => ({ type: JOIN_ROOM_REQUEST });
const joinRoom_success = (data?: any) => ({ type: JOIN_ROOM_SUCCESS, payload: data });
const joinRoom_failure = () => ({ type: JOIN_ROOM_FAILURE });
export function joinRoom(roomId: string, token: string, username: string) {
    return (dispatch) => {
        dispatch(joinRoom_request());

        BackendFactory.getInstance().getServer().then(server => {
            server.JoinChatRoomRequest(token, username, roomId, (err, res) => {
                console.log("JoinChatRoomRequest value", res);

                if (err || res.code !== HTTPStatus.success) {
                    dispatch(joinRoom_failure());
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        }).catch(err => {
            dispatch(joinRoom_failure());
        });
    };
}

export const LEAVE_ROOM = "LEAVE_ROOM";
export const LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
const leaveRoom = () => ({ type: LEAVE_ROOM });
const leaveRoomSuccess = () => ({ type: LEAVE_ROOM_SUCCESS });
export function leaveRoomAction() {
    return (dispatch) => {
        let token = Store.getState().stalkReducer.stalkToken;
        let room = ChatRoomComponent.getInstance();
        let room_id = room.getRoomId();

        dispatch(leaveRoom());

        BackendFactory.getInstance().getServer().then(server => {
            server.LeaveChatRoomRequest(token, room_id, (err, res) => {
                console.log("LeaveChatRoomRequest", err, res);
                ChatRoomComponent.getInstance().dispose();
                NotificationManager.regisNotifyNewMessageEvent();
            });

            dispatch(updateLastAccessRoom(room_id));
        }).catch(err => {
            dispatch(updateLastAccessRoom(room_id));
        });
    };
}

export const DISABLE_CHATROOM = "DISABLE_CHATROOM";
export const ENABLE_CHATROOM = "ENABLE_CHATROOM";
export const disableChatRoom = () => ({ type: DISABLE_CHATROOM });
export const enableChatRoom = () => ({ type: ENABLE_CHATROOM });

const loadEarlyMessage_success = () => ({ type: ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS });
export function loadEarlyMessageChunk() {
    return dispatch => {
        ChatRoomComponent.getInstance().getOlderMessageChunk(function done(err, res) {
            dispatch(loadEarlyMessage_success());
            // @check older message again.
            dispatch(checkOlderMessages());
        });
    };
}

const GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
const GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
export const GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
export const GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
const getPersistChatroomFail = () => ({ type: GET_PERSISTEND_CHATROOM_FAILURE });
const getPersistChatroomSuccess = createAction(GET_PERSISTEND_CHATROOM_SUCCESS, (roomInfo: Room) => roomInfo);
export const getPersistendChatroom = (roomId: string) => (dispatch => {
    dispatch({ type: GET_PERSISTEND_CHATROOM, payload: roomId });

    const dataManager = BackendFactory.getInstance().dataManager;
    dataManager.roomDAL.get(roomId).then(room => {
        if (room)
            dispatch(getPersistChatroomSuccess(room));
        else
            dispatch(getPersistChatroomFail());
    });
});

export const createChatRoom = (myUser, contactUser) => {
    if (myUser && contactUser) {
        let owner = {} as IMember;
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;

        let contact = {} as IMember;
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = contactUser.username;

        let members = { owner, contact };

        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");

        return null;
    }
};