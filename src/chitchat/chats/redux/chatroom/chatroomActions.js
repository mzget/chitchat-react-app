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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var R = require("ramda");
var stalk_js_1 = require("stalk-js");
var chatroomService = require("../../services/chatroomService");
var MessageService = require("../../services/MessageService");
var ChatRoomComponent_1 = require("../../ChatRoomComponent");
var BackendFactory_1 = require("../../BackendFactory");
var secureServiceFactory_1 = require("../../secure/secureServiceFactory");
var NotificationManager = require("../stalkBridge/StalkNotificationActions");
var chatlogRxActions_1 = require("../chatlogs/chatlogRxActions");
var Room_1 = require("../../..//shared/Room");
var Message_1 = require("../../../shared/Message");
var ChitchatFactory_1 = require("../../ChitchatFactory");
var getStore = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().store; };
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
var appReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().appStore; };
var secure = secureServiceFactory_1["default"].getService();
/**
 * ChatRoomActionsType
 */
var ChatRoomActionsType = (function () {
    function ChatRoomActionsType() {
    }
    return ChatRoomActionsType;
}());
ChatRoomActionsType.SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
ChatRoomActionsType.SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
ChatRoomActionsType.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
ChatRoomActionsType.REPLACE_MESSAGE = "REPLACE_MESSAGE";
ChatRoomActionsType.ON_NEW_MESSAGE = "ON_NEW_MESSAGE";
ChatRoomActionsType.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
exports.ChatRoomActionsType = ChatRoomActionsType;
exports.CHATROOM_REDUCER_EMPTY_STATE = "CHATROOM_REDUCER_EMPTY_STATE";
exports.emptyState = function () { return ({ type: exports.CHATROOM_REDUCER_EMPTY_STATE }); };
function initChatRoom(currentRoom) {
    if (!currentRoom) {
        throw new Error("Empty roomInfo");
    }
    var room_name = currentRoom.name;
    if (!room_name && currentRoom.type === Room_1.RoomType.privateChat) {
        currentRoom.members.some(function (v, id, arr) {
            if (v._id !== authReducer().user._id) {
                currentRoom.name = v.username;
                return true;
            }
        });
    }
    var chatroomComp = ChatRoomComponent_1.ChatRoomComponent.createInstance();
    chatroomComp.setRoomId(currentRoom._id);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, newMsg) {
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        console.log("onChatRoomDelegate: ", stalk_js_1.ChatEvents.ON_CHAT, newMsg);
        var backendFactory = BackendFactory_1.BackendFactory.getInstance();
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (backendFactory.dataManager.isMySelf(newMsg.sender)) {
            // dispatch(replaceMyMessage(newMsg));
            console.log("is my message");
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            var appState = appReducer().appState;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    MessageService.updateMessageReader(newMsg._id, newMsg.rid).then(function (response) { return response.json(); }).then(function (value) {
                        console.log("updateMessageReader: ", value);
                    })["catch"](function (err) {
                        console.warn("updateMessageReader: ", err);
                    });
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
    else if (event === stalk_js_1.ChatEvents.ON_MESSAGE_READ) {
        console.log("serviceListener: ", stalk_js_1.ChatEvents.ON_MESSAGE_READ, newMsg);
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        console.log("Call notification here...", data); // active, background, inactive
        NotificationManager.notify(data);
    }
}
var onNewMessage = function (message) { return ({ type: ChatRoomActionsType.ON_NEW_MESSAGE, payload: message }); };
var onEarlyMessageReady = function (data) { return ({ type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY, payload: data }); };
function checkOlderMessages() {
    return function (dispatch) {
        var room = getStore().getState().chatroomReducer.room;
        ChatRoomComponent_1.ChatRoomComponent.getInstance().getTopEdgeMessageTime().then(function (res) {
            chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
                .then(function (response) { return response.json(); })
                .then(function (result) {
                console.log("getOlderMessagesCount", result);
                if (result.success && result.result > 0) {
                    //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(true));
                }
                else {
                    //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                    dispatch(onEarlyMessageReady(false));
                }
            })["catch"](function (err) {
                console.warn("getOlderMessagesCount fail", err);
                dispatch(onEarlyMessageReady(false));
            });
        });
    };
}
exports.checkOlderMessages = checkOlderMessages;
exports.GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
exports.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
exports.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
var getNewerMessage = function () { return ({ type: exports.GET_NEWER_MESSAGE }); };
function getNewerMessage_failure() {
    return { type: exports.GET_NEWER_MESSAGE_FAILURE };
}
function getNewerMessage_success(messages) {
    return { type: exports.GET_NEWER_MESSAGE_SUCCESS, payload: messages };
}
function getNewerMessageFromNet() {
    return function (dispatch) {
        dispatch(getNewerMessage());
        var token = authReducer().chitchat_token;
        ChatRoomComponent_1.ChatRoomComponent.getInstance().getNewerMessageRecord(token, function (results) {
            dispatch(getNewerMessage_success(results));
            // @Todo next joinroom function is ready to call.
        })["catch"](function (err) {
            if (err)
                console.warn("getNewerMessageRecord fail", err);
            dispatch(getNewerMessage_failure());
        });
    };
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function getMessages() {
    return __awaiter(this, void 0, void 0, function () {
        var chatroomComp, messages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatroomComp = ChatRoomComponent_1.ChatRoomComponent.getInstance();
                    return [4 /*yield*/, chatroomComp.getMessages()];
                case 1:
                    messages = _a.sent();
                    return [2 /*return*/, messages];
            }
        });
    });
}
exports.getMessages = getMessages;
var send_message_request = function () { return ({ type: ChatRoomActionsType.SEND_MESSAGE_REQUEST }); };
var send_message_success = function (data) { return ({ type: ChatRoomActionsType.SEND_MESSAGE_SUCCESS, payload: data }); };
var send_message_failure = function (error) { return ({ type: ChatRoomActionsType.SEND_MESSAGE_FAILURE, payload: error }); };
function sendMessage(message) {
    return function (dispatch) {
        dispatch(send_message_request());
        if (message.type === Message_1.MessageType[Message_1.MessageType.Location]) {
            var backendFactory = BackendFactory_1.BackendFactory.getInstance();
            var chatApi = backendFactory.getServer().getChatRoomAPI();
            chatApi.chat("*", message, function (err, res) {
                dispatch(sendMessageResponse(err, res));
            });
            return;
        }
        if (message.type === Message_1.MessageType[Message_1.MessageType.Text] && getConfig().appConfig.encryption === true) {
            secure.encryption(message.body).then(function (result) {
                message.body = result;
                var backendFactory = BackendFactory_1.BackendFactory.getInstance();
                var chatApi = backendFactory.getServer().getChatRoomAPI();
                chatApi.chat("*", message, function (err, res) {
                    dispatch(sendMessageResponse(err, res));
                });
            })["catch"](function (err) {
                console.error(err);
                dispatch(send_message_failure(err));
            });
        }
        else {
            var backendFactory = BackendFactory_1.BackendFactory.getInstance();
            var chatApi = backendFactory.getServer().getChatRoomAPI();
            chatApi.chat("*", message, function (err, res) {
                dispatch(sendMessageResponse(err, res));
            });
        }
    };
}
exports.sendMessage = sendMessage;
function sendMessageResponse(err, res) {
    return function (dispatch) {
        if (!!err) {
            dispatch(send_message_failure(err.message));
        }
        else {
            console.log("server response!", res);
            if (res.code == stalk_js_1.Utils.statusCode.success && res.data.hasOwnProperty("resultMsg")) {
                var _msg_1 = __assign({}, res.data.resultMsg);
                if (_msg_1.type === Message_1.MessageType[Message_1.MessageType.Text] && getConfig().appConfig.encryption) {
                    secure.decryption(_msg_1.body).then(function (res) {
                        _msg_1.body = res;
                        dispatch(send_message_success(_msg_1));
                    })["catch"](function (err) {
                        console.error(err);
                        _msg_1.body = err.toString();
                        dispatch(send_message_success(_msg_1));
                    });
                }
                else {
                    dispatch(send_message_success(_msg_1));
                }
            }
            else {
                dispatch(send_message_failure(res.message));
            }
        }
    };
}
var JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
exports.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
exports.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
var joinRoom_request = function () { return ({ type: JOIN_ROOM_REQUEST }); };
var joinRoom_success = function (data) { return ({ type: exports.JOIN_ROOM_SUCCESS, payload: data }); };
var joinRoom_failure = function (error) { return ({ type: exports.JOIN_ROOM_FAILURE, payload: error }); };
function joinRoom(roomId, token, username) {
    return function (dispatch) {
        dispatch(joinRoom_request());
        try {
            var backendFactory = BackendFactory_1.BackendFactory.getInstance();
            var server = backendFactory.getServer();
            server.getLobby().joinRoom(token, username, roomId, function (err, res) {
                console.log("JoinChatRoomRequest value", res);
                if (err || res.code !== stalk_js_1.Utils.statusCode.success) {
                    dispatch(joinRoom_failure(err));
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        }
        catch (ex) {
            dispatch(joinRoom_failure(ex.message));
        }
    };
}
exports.joinRoom = joinRoom;
exports.LEAVE_ROOM = "LEAVE_ROOM";
exports.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
var leaveRoom = function () { return ({ type: exports.LEAVE_ROOM }); };
var leaveRoomSuccess = function () { return ({ type: exports.LEAVE_ROOM_SUCCESS }); };
function leaveRoomAction() {
    return function (dispatch) {
        var _room = getStore().getState().chatroomReducer.get("room");
        if (!!_room) {
            var token = getStore().getState().stalkReducer.stalkToken;
            var room_id = _room._id;
            ChatRoomComponent_1.ChatRoomComponent.getInstance().dispose();
            dispatch(leaveRoom());
            try {
                var backendFactory = BackendFactory_1.BackendFactory.getInstance();
                var server = backendFactory.getServer();
                server.getLobby().leaveRoom(token, room_id, function (err, res) {
                    console.log("LeaveChatRoomRequest", err, res);
                    NotificationManager.regisNotifyNewMessageEvent();
                });
                dispatch(chatlogRxActions_1.updateLastAccessRoom(room_id));
            }
            catch (ex) {
                dispatch(chatlogRxActions_1.updateLastAccessRoom(room_id));
            }
        }
        else {
            dispatch({ type: "" });
        }
    };
}
exports.leaveRoomAction = leaveRoomAction;
exports.DISABLE_CHATROOM = "DISABLE_CHATROOM";
exports.ENABLE_CHATROOM = "ENABLE_CHATROOM";
exports.disableChatRoom = function () { return ({ type: exports.DISABLE_CHATROOM }); };
exports.enableChatRoom = function () { return ({ type: exports.ENABLE_CHATROOM }); };
exports.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
var loadEarlyMessage_success = function (payload) { return ({ type: exports.LOAD_EARLY_MESSAGE_SUCCESS, payload: payload }); };
function loadEarlyMessageChunk() {
    return function (dispatch) {
        ChatRoomComponent_1.ChatRoomComponent.getInstance().getOlderMessageChunk().then(function (res) {
            dispatch(loadEarlyMessage_success(res));
            // @check older message again.
            dispatch(checkOlderMessages());
        })["catch"](function (err) {
            console.warn("loadEarlyMessageChunk fail", err);
        });
    };
}
exports.loadEarlyMessageChunk = loadEarlyMessageChunk;
exports.GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
var GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
exports.GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
exports.GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
var getPersistChatroomFail = function () { return ({ type: exports.GET_PERSISTEND_CHATROOM_FAILURE }); };
var getPersistChatroomSuccess = function (roomInfo) { return ({ type: exports.GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo }); };
exports.getPersistendChatroom = function (roomId) { return (function (dispatch) {
    dispatch({ type: exports.GET_PERSISTEND_CHATROOM, payload: roomId });
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    var rooms = chatrooms.filter(function (room, index, array) {
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
}); };
exports.getRoom = function (room_id) {
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    var rooms = chatrooms.filter(function (room, index, array) {
        if (room._id.toString() == room_id) {
            return room;
        }
    });
    return rooms[0];
};
exports.createChatRoom = function (myUser, contactUser) {
    if (myUser && contactUser) {
        var owner = {};
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;
        var contact = {};
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = contactUser.username;
        var members = { owner: owner, contact: contact };
        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");
        return null;
    }
};
exports.UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
exports.updatedChatRoomSuccess = function (chatrooms) { return ({ type: exports.UPDATED_CHATROOMS, payload: chatrooms }); };
exports.updateChatRoom = function (rooms) {
    return function (dispatch) {
        var chatrooms = getStore().getState().chatroomReducer.get("chatrooms");
        if (chatrooms) {
            // R.unionWith(R.eqBy(R.prop('a')), l1, l2);
            var _newRooms = R.unionWith(R.eqBy(R.prop("_id")), rooms, chatrooms);
            dispatch(exports.updatedChatRoomSuccess(_newRooms));
        }
        else {
            chatrooms = rooms.slice();
            dispatch(exports.updatedChatRoomSuccess(chatrooms));
        }
    };
};
