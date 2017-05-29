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
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var BackendFactory_1 = require("../../BackendFactory");
var chatslogComponent_1 = require("../../chatslogComponent");
var chatroomActions = require("../chatroom/chatroomActions");
var chitchatFactory_1 = require("../../chitchatFactory");
var getStore = function () { return chitchatFactory_1.ChitChatFactory.getInstance().store; };
var authReducer = function () { return chitchatFactory_1.ChitChatFactory.getInstance().authStore; };
exports.STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
var listenerImp = function (newMsg) {
    var dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        var unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        var count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
    }
};
function updateLastAccessTimeEventHandler(newRoomAccess) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    var _id = authReducer().user._id;
    chatsLogComp.getUnreadMessage(_id, newRoomAccess).then(function (unread) {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
        // chatLogDAL.savePersistedUnreadMsgMap(unread);
    })["catch"](function (err) {
        if (err)
            console.warn("updateLastAccessTimeEventHandler fail", err);
    });
}
function initChatsLog() {
    var chatsLogComponent = BackendFactory_1.BackendFactory.getInstance().createChatlogs();
    chatsLogComponent.onReady = function (rooms) {
        getStore().dispatch(chatroomActions.updateChatRoom(rooms));
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = function () {
        var chatrooms = getStore().getState().chatroomReducer.chatrooms;
        chatsLogComponent.manageChatLog(chatrooms).then(function (chatlog) {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = function (data) {
        getUnreadMessages();
    };
    getStore().dispatch({ type: exports.STALK_INIT_CHATLOG });
}
exports.initChatsLog = initChatsLog;
function getUnreadMessages() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    var _id = authReducer().user._id;
    var _a = getStore().getState().chatlogReducer, roomAccess = _a.roomAccess, state = _a.state;
    chatsLogComp.getUnreadMessages(_id, roomAccess, function done(err, unreadLogs) {
        if (!!unreadLogs) {
            chatsLogComp.setUnreadMessageMap(unreadLogs);
            calculateUnreadCount();
            getUnreadMessageComplete();
        }
        if (roomAccess.length == 0) {
            getChatsLog();
        }
    });
}
function calculateUnreadCount() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    var chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function () {
        var chatsLogComp, chatrooms, room, chatsLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
                    chatrooms = getStore().getState().chatroomReducer.chatrooms;
                    return [4 /*yield*/, chatsLogComp.checkRoomInfo(unread, chatrooms)];
                case 1:
                    room = _a.sent();
                    if (room) {
                        updateRooms(room);
                    }
                    chatsLog = chatsLogComp.getChatsLog();
                    getStore().dispatch({
                        type: exports.STALK_CHATLOG_MAP_CHANGED,
                        payload: chatsLog
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function getUnreadMessageComplete() {
    var chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    var _id = authReducer().user._id;
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
var getChatLogContact = function (chatlog) {
    var dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    var contacts = chatlog.room.members.filter(function (value) {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
function updateRooms(room) {
    return __awaiter(this, void 0, void 0, function () {
        var chatrooms, id;
        return __generator(this, function (_a) {
            chatrooms = getStore().getState().chatroomReducer.chatrooms;
            if (Array.isArray(chatrooms) && chatrooms.length > 0) {
                chatrooms.forEach(function (v) {
                    if (v._id == room._id) {
                        v = room;
                    }
                });
                id = chatrooms.indexOf(room);
                if (id < 0) {
                    chatrooms.push(room);
                }
            }
            else {
                chatrooms = new Array();
                chatrooms.push(room);
            }
            getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
            return [2 /*return*/];
        });
    });
}
