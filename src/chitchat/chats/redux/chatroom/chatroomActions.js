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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const R = require("ramda");
const chatroomService = require("../../services/chatroomService");
const chatRoomComponent_1 = require("../../chatRoomComponent");
const BackendFactory_1 = require("../../BackendFactory");
const secureServiceFactory_1 = require("../../secure/secureServiceFactory");
const NotificationManager = require("../stalkBridge/StalkNotificationActions");
const serverEventListener_1 = require("../../../libs/stalk/serverEventListener");
const httpStatusCode_1 = require("../../../libs/stalk/utils/httpStatusCode");
const chatlogRxActions_1 = require("../chatlogs/chatlogRxActions");
const Room_1 = require("../../../libs/shared/Room");
const Message_1 = require("../../../libs/shared/Message");
const chitchatFactory_1 = require("../../chitchatFactory");
const getStore = () => chitchatFactory_1.ChitChatFactory.getInstance().store;
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => chitchatFactory_1.ChitChatFactory.getInstance().authStore;
const appReducer = () => chitchatFactory_1.ChitChatFactory.getInstance().appStore;
const secure = secureServiceFactory_1.default.getService();
/**
 * ChatRoomActionsType
 */
class ChatRoomActionsType {
}
ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
ChatRoomActionsType.SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
ChatRoomActionsType.REPLACE_MESSAGE = "REPLACE_MESSAGE";
ChatRoomActionsType.ON_NEW_MESSAGE = "ON_NEW_MESSAGE";
ChatRoomActionsType.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
exports.ChatRoomActionsType = ChatRoomActionsType;
exports.CHATROOM_REDUCER_EMPTY_STATE = "CHATROOM_REDUCER_EMPTY_STATE";
exports.emptyState = () => ({ type: exports.CHATROOM_REDUCER_EMPTY_STATE });
function initChatRoom(currentRoom) {
    if (!currentRoom)
        throw new Error("Empty roomInfo");
    let room_name = currentRoom.name;
    if (!room_name && currentRoom.type === Room_1.RoomType.privateChat) {
        currentRoom.members.some((v, id, arr) => {
            if (v._id !== getStore().getState().userReducer.user._id) {
                currentRoom.name = v.username;
                return true;
            }
        });
    }
    let chatroomComp = chatRoomComponent_1.default.getInstance();
    chatroomComp.setRoomId(currentRoom._id);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, newMsg) {
    if (event === serverEventListener_1.default.ON_CHAT) {
        console.log("onChatRoomDelegate: ", serverEventListener_1.default.ON_CHAT, newMsg);
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (BackendFactory_1.BackendFactory.getInstance().dataManager.isMySelf(newMsg.sender)) {
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            let appState = appReducer().appState;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    BackendFactory_1.BackendFactory.getInstance().getChatApi().updateMessageReader(newMsg._id, newMsg.rid);
                }
                else if (appState !== "active") {
                    // @ When user joined room but appState is inActive.
                    // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                    console.warn("Call local notification here...");
                }
            }
            getStore().dispatch(onNewMessage(newMsg));
        }
    }
    else if (event === serverEventListener_1.default.ON_MESSAGE_READ) {
        console.log("serviceListener: ", serverEventListener_1.default.ON_MESSAGE_READ, newMsg);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === serverEventListener_1.default.ON_CHAT) {
        console.log("Call notification here...", data); // active, background, inactive
        NotificationManager.notify(data);
    }
}
const onNewMessage = (message) => ({ type: ChatRoomActionsType.ON_NEW_MESSAGE, payload: message });
const onEarlyMessageReady = (data) => ({ type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY, payload: data });
function checkOlderMessages() {
    return dispatch => {
        let room = getStore().getState().chatroomReducer.room;
        chatRoomComponent_1.default.getInstance().getTopEdgeMessageTime().then(res => {
            chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
                .then(response => response.json())
                .then((result) => {
                console.log("getOlderMessagesCount", result);
                if (result.success && result.result > 0) {
                    //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(true));
                }
                else {
                    //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(false));
                }
            }).catch(err => {
                console.warn("getOlderMessagesCount fail", err);
                dispatch(onEarlyMessageReady(false));
            });
        });
    };
}
exports.checkOlderMessages = checkOlderMessages;
function getNewerMessage_failure() {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success(messages) {
    return { type: ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS, payload: messages };
}
function getNewerMessageFromNet() {
    return dispatch => {
        let token = authReducer().chitchat_token;
        chatRoomComponent_1.default.getInstance().getNewerMessageRecord(token, (results) => {
            dispatch(getNewerMessage_success(results));
            // @Todo next joinroom function is ready to call.
        }).catch(err => {
            if (err)
                console.warn("getNewerMessageRecord fail", err);
            dispatch(getNewerMessage_failure());
        });
    };
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function getMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        let chatroomComp = chatRoomComponent_1.default.getInstance();
        let messages = yield chatroomComp.getMessages();
        return messages;
    });
}
exports.getMessages = getMessages;
const send_message_request = () => ({ type: ChatRoomActionsType.SEND_MESSAGE_REQUEST });
const send_message_success = (data) => ({ type: ChatRoomActionsType.SEND_MESSAGE_SUCCESS, payload: data });
const send_message_failure = (error) => ({ type: ChatRoomActionsType.SEND_MESSAGE_FAILURE, payload: error });
function sendMessage(message) {
    return (dispatch) => {
        dispatch(send_message_request());
        if (message.type === Message_1.MessageType[Message_1.MessageType.Location]) {
            BackendFactory_1.BackendFactory.getInstance().getChatApi().chat("*", message, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }
        if (message.type === Message_1.MessageType[Message_1.MessageType.Text] && getConfig().appConfig.encryption === true) {
            secure.encryption(message.body).then(result => {
                message.body = result;
                BackendFactory_1.BackendFactory.getInstance().getChatApi().chat("*", message, (err, res) => {
                    dispatch(sendMessageResponse(err, res));
                });
            }).catch(err => {
                console.error(err);
                dispatch(send_message_failure(err));
            });
        }
        else {
            BackendFactory_1.BackendFactory.getInstance().getChatApi().chat("*", message, (err, res) => {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}
exports.sendMessage = sendMessage;
function sendMessageResponse(err, res) {
    return dispatch => {
        if (!!err) {
            dispatch(send_message_failure(err.message));
        }
        else {
            console.log("server response!", res);
            if (res.code == httpStatusCode_1.default.success && res.data.hasOwnProperty("resultMsg")) {
                let _msg = __assign({}, res.data.resultMsg);
                if (_msg.type === Message_1.MessageType[Message_1.MessageType.Text] && getConfig().appConfig.encryption) {
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
exports.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
exports.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
const joinRoom_request = () => ({ type: JOIN_ROOM_REQUEST });
const joinRoom_success = (data) => ({ type: exports.JOIN_ROOM_SUCCESS, payload: data });
const joinRoom_failure = () => ({ type: exports.JOIN_ROOM_FAILURE });
function joinRoom(roomId, token, username) {
    return (dispatch) => {
        dispatch(joinRoom_request());
        BackendFactory_1.BackendFactory.getInstance().getServer().then(server => {
            server.JoinChatRoomRequest(token, username, roomId, (err, res) => {
                console.log("JoinChatRoomRequest value", res);
                if (err || res.code !== httpStatusCode_1.default.success) {
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
exports.LEAVE_ROOM = "LEAVE_ROOM";
exports.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
const leaveRoom = () => ({ type: exports.LEAVE_ROOM });
const leaveRoomSuccess = () => ({ type: exports.LEAVE_ROOM_SUCCESS });
function leaveRoomAction() {
    return (dispatch) => {
        let token = getStore().getState().stalkReducer.stalkToken;
        let room = chatRoomComponent_1.default.getInstance();
        let room_id = room.getRoomId();
        dispatch(leaveRoom());
        BackendFactory_1.BackendFactory.getInstance().getServer().then(server => {
            server.LeaveChatRoomRequest(token, room_id, (err, res) => {
                console.log("LeaveChatRoomRequest", err, res);
                chatRoomComponent_1.default.getInstance().dispose();
                NotificationManager.regisNotifyNewMessageEvent();
            });
            dispatch(chatlogRxActions_1.updateLastAccessRoom(room_id));
        }).catch(err => {
            dispatch(chatlogRxActions_1.updateLastAccessRoom(room_id));
        });
    };
}
exports.leaveRoomAction = leaveRoomAction;
exports.DISABLE_CHATROOM = "DISABLE_CHATROOM";
exports.ENABLE_CHATROOM = "ENABLE_CHATROOM";
exports.disableChatRoom = () => ({ type: exports.DISABLE_CHATROOM });
exports.enableChatRoom = () => ({ type: exports.ENABLE_CHATROOM });
exports.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
const loadEarlyMessage_success = (payload) => ({ type: exports.LOAD_EARLY_MESSAGE_SUCCESS, payload });
function loadEarlyMessageChunk() {
    return dispatch => {
        chatRoomComponent_1.default.getInstance().getOlderMessageChunk().then(res => {
            dispatch(loadEarlyMessage_success(res));
            // @check older message again.
            dispatch(checkOlderMessages());
        }).catch(err => {
            console.warn("loadEarlyMessageChunk fail", err);
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
    const { chatrooms } = getStore().getState().chatroomReducer;
    const rooms = chatrooms.filter((room, index, array) => {
        if (room._id.toString() == roomId) {
            return room;
        }
    });
    if (rooms.length > 0) {
        dispatch(getPersistChatroomSuccess(rooms[0]));
    }
    else {
        dispatch(getPersistChatroomFail());
    }
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
exports.UPDATE_CHATROOMS = "UPDATE_CHATROOMS";
exports.UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
exports.updatedChatRoomSuccess = (chatrooms) => ({ type: exports.UPDATED_CHATROOMS, payload: chatrooms });
exports.updateChatRoom = (rooms) => {
    return dispatch => {
        dispatch({ type: exports.UPDATE_CHATROOMS, payload: rooms });
        let chatrooms = getStore().getState().chatroomReducer.get("chatrooms");
        if (chatrooms) {
            let _newRooms = R.union(chatrooms, rooms);
            dispatch(exports.updatedChatRoomSuccess(_newRooms));
        }
        else {
            chatrooms = rooms.slice();
            dispatch(exports.updatedChatRoomSuccess(chatrooms));
        }
    };
};
