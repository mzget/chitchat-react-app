/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const chatRoomComponent_1 = require("../../chats/chatRoomComponent");
const BackendFactory_1 = require("../../chats/BackendFactory");
const secureServiceFactory_1 = require("../../libs/chitchat/services/secureServiceFactory");
const serverEventListener_1 = require("../../libs/stalk/serverEventListener");
const httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
const ChatDataModels_1 = require("../../chats/models/ChatDataModels");
const NotificationManager = require("../stalkBridge/StalkNotificationActions");
const configureStore_1 = require("../configureStore");
const config_1 = require("../../configs/config");
const secure = secureServiceFactory_1.default.getService();
/**
 * ChatRoomActionsType
 */
class ChatRoomActionsType {
}
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_REQUEST = "GET_PERSISTEND_MESSAGE_REQUEST";
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
ChatRoomActionsType.GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
ChatRoomActionsType.SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
ChatRoomActionsType.JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
ChatRoomActionsType.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
ChatRoomActionsType.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
ChatRoomActionsType.REPLACE_MESSAGE = "REPLACE_MESSAGE";
ChatRoomActionsType.ON_NEW_MESSAGE = "ON_NEW_MESSAGE";
ChatRoomActionsType.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
exports.ChatRoomActionsType = ChatRoomActionsType;
exports.CHATROOM_REDUCER_EMPTY_STATE = "CHATROOM_REDUCER_EMPTY_STATE";
exports.emptyState = () => ({ type: exports.CHATROOM_REDUCER_EMPTY_STATE });
function initChatRoom(currentRoom) {
    if (!currentRoom)
        throw new Error("Empty roomInfo");
    let chatroomComp = chatRoomComponent_1.default.getInstance();
    chatroomComp.setRoomId(currentRoom._id);
    BackendFactory_1.default.getInstance().dataListener.addChatListenerImp(chatroomComp);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, newMsg) {
    if (event == serverEventListener_1.default.ON_CHAT) {
        console.log("onChatRoomDelegate: ", serverEventListener_1.default.ON_CHAT, newMsg);
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (BackendFactory_1.default.getInstance().dataManager.isMySelf(newMsg.sender)) {
        }
        else {
            console.log("is contact message");
            //@ Check app not run in background.
            let device = configureStore_1.default.getState().deviceReducer;
            console.warn("AppState: ", device.appState); //active, background, inactive
            if (device.appState == "active") {
                BackendFactory_1.default.getInstance().getChatApi().updateMessageReader(newMsg._id, newMsg.rid);
            }
            else if (device.appState != "active") {
                //@ When user joined room but appState is inActive.
                // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                console.warn("Call local notification here...");
            }
            configureStore_1.default.dispatch(onNewMessage(newMsg));
        }
    }
    else if (event === serverEventListener_1.default.ON_MESSAGE_READ) {
        console.log("serviceListener: ", serverEventListener_1.default.ON_MESSAGE_READ, newMsg);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === serverEventListener_1.default.ON_CHAT) {
        console.log("Call notification here..."); //active, background, inactive
        NotificationManager.notify(data);
    }
}
function replaceMyMessage(receiveMsg) {
    return {
        type: ChatRoomActionsType.REPLACE_MESSAGE,
        payload: receiveMsg
    };
}
const onNewMessage = (message) => ({ type: ChatRoomActionsType.ON_NEW_MESSAGE, payload: message });
function getPersistendMessage_request() { return { type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_REQUEST }; }
function getPersistendMessage_success(data) {
    return {
        type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS,
        payload: data
    };
}
const getPersistendMessage_failure = () => ({ type: ChatRoomActionsType.GET_PERSISTEND_MESSAGE_FAILURE });
function getPersistendMessage(currentRid) {
    return (dispatch) => {
        dispatch(getPersistendMessage_request());
        chatRoomComponent_1.default.getInstance().getPersistentMessage(currentRid).then(function (messages) {
            console.log("getPersistendMessage of room %s: completed.", currentRid);
            dispatch(getPersistendMessage_success());
        }).catch(err => dispatch(getPersistendMessage_failure()));
        //@ Next call 2 method below. -->
        //getNewerMessageFromNet();
        //checkOlderMessages();
    };
}
exports.getPersistendMessage = getPersistendMessage;
function onEarlyMessageReady(data) {
    return {
        type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY,
        payload: data
    };
}
function checkOlderMessages() {
    return dispatch => {
        chatRoomComponent_1.default.getInstance().checkOlderMessages(function done(err, res) {
            if (!err && res.data > 0) {
                console.info('has olderMessage => %s', res.data);
                //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                dispatch(onEarlyMessageReady(true));
            }
            else {
                //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                dispatch(onEarlyMessageReady(false));
            }
        });
    };
}
exports.checkOlderMessages = checkOlderMessages;
function getNewerMessage_failure() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS };
}
function getNewerMessageFromNet() {
    return dispatch => {
        chatRoomComponent_1.default.getInstance().getNewerMessageRecord(function done(err, result) {
            if (err) {
                dispatch(getNewerMessage_failure());
            }
            else {
                dispatch(getNewerMessage_success());
            }
            //@ Todo next joinroom function is ready to call.
        });
    };
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function getMessages() {
    let chatroomComp = chatRoomComponent_1.default.getInstance();
    return chatroomComp.getMessages();
}
exports.getMessages = getMessages;
function send_message_request() {
    return { type: ChatRoomActionsType.SEND_MESSAGE_REQUEST };
}
function send_message_success(data) {
    return {
        type: ChatRoomActionsType.SEND_MESSAGE_SUCCESS,
        payload: data
    };
}
function send_message_failure(data) {
    return {
        type: ChatRoomActionsType.SEND_MESSAGE_FAILURE,
        payload: data
    };
}
function sendMessage(msg) {
    return (dispatch) => {
        dispatch(send_message_request());
        if (msg.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }
        if (msg.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text] && config_1.default.appConfig.encryption == true) {
            secure.encryption(msg.body).then(result => {
                // secure.decryption(result).then(res => {
                //     console.log(res);
                // }).catch(err => {
                //     console.error(err);
                // });
                msg.body = result;
                BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, (err, res) => {
                    dispatch(sendMessageResponse(err, res));
                });
            }).catch(err => {
                console.error(err);
                dispatch(send_message_failure(err));
            });
        }
        else {
            BackendFactory_1.default.getInstance().getChatApi().chat("*", msg, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}
exports.sendMessage = sendMessage;
function sendMessageResponse(err, res) {
    return dispatch => {
        if (!!err || res.code !== httpStatusCode_1.default.success) {
            dispatch(send_message_failure(res.body));
        }
        else {
            console.log('server response!', res);
            if (res.data.hasOwnProperty('resultMsg')) {
                let _msg = __assign({}, res.data.resultMsg);
                if (_msg.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text] && config_1.default.appConfig.encryption) {
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
                dispatch(send_message_failure(res.body));
            }
        }
    };
}
function joinRoom_request() {
    return { type: ChatRoomActionsType.JOIN_ROOM_REQUEST };
}
function joinRoom_success(data) {
    return { type: ChatRoomActionsType.JOIN_ROOM_SUCCESS, payload: data };
}
function joinRoom_failure() {
    return { type: ChatRoomActionsType.JOIN_ROOM_FAILURE };
}
function joinRoom(roomId, token, username) {
    return (dispatch) => {
        dispatch(joinRoom_request());
        BackendFactory_1.default.getInstance().getServer().then(server => {
            server.JoinChatRoomRequest(token, username, roomId, (err, res) => {
                if (err || res.code != httpStatusCode_1.default.success) {
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
exports.joinRoom = joinRoom;
exports.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
function leaveRoom() {
    return (dispatch) => {
        let token = BackendFactory_1.default.getInstance().dataManager.getSessionToken();
        let room = chatRoomComponent_1.default.getInstance();
        BackendFactory_1.default.getInstance().getServer().then(server => {
            server.LeaveChatRoomRequest(token, room.getRoomId(), (err, res) => {
                BackendFactory_1.default.getInstance().dataListener.removeChatListenerImp(room);
                chatRoomComponent_1.default.getInstance().dispose();
                NotificationManager.regisNotifyNewMessageEvent();
            });
        }).catch(err => {
        });
        dispatch({ type: exports.LEAVE_ROOM_SUCCESS });
    };
}
exports.leaveRoom = leaveRoom;
const loadEarlyMessage_success = () => ({ type: ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS });
function loadEarlyMessageChunk() {
    return dispatch => {
        chatRoomComponent_1.default.getInstance().getOlderMessageChunk(function done(err, res) {
            dispatch(loadEarlyMessage_success());
            //@ check older message again.
            dispatch(checkOlderMessages());
        });
    };
}
exports.loadEarlyMessageChunk = loadEarlyMessageChunk;
const GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
const GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
exports.GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
exports.GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
const getPersistChatroomFail = () => ({ type: exports.GET_PERSISTEND_CHATROOM_FAILURE });
const getPersistChatroomSuccess = (roomInfo) => ({ type: exports.GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo });
exports.getPersistendChatroom = (roomId) => (dispatch => {
    dispatch({ type: GET_PERSISTEND_CHATROOM, payload: roomId });
    const dataManager = BackendFactory_1.default.getInstance().dataManager;
    dataManager.roomDAL.get(roomId).then(room => {
        if (room)
            dispatch(getPersistChatroomSuccess(room));
        else
            dispatch(getPersistChatroomFail());
    });
});
exports.createChatRoom = (myUser, contactUser) => {
    if (myUser && contactUser) {
        let owner = {};
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;
        let contact = {};
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
