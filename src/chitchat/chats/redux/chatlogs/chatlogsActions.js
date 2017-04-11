"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const BackendFactory_1 = require("../../BackendFactory");
const chatslogComponent_1 = require("../../chatslogComponent");
const ServiceProvider = require("../../services/ServiceProvider");
const chatroomActions = require("../chatroom/chatroomActions");
const chitchatFactory_1 = require("../../chitchatFactory");
const getStore = () => chitchatFactory_1.ChitChatFactory.getInstance().store;
exports.STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
const listenerImp = (newMsg) => {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        let unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
        //             chatLogDAL.savePersistedUnreadMsgMap(unread);
    }
};
function updateLastAccessTimeEventHandler(newRoomAccess) {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let user_id = getStore().getState().stalkReducer.user._id;
    chatsLogComp.getUnreadMessage(user_id, newRoomAccess.roomAccess[0]).then(function (unread) {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
        // chatLogDAL.savePersistedUnreadMsgMap(unread);
    }).catch(err => {
        console.warn("updateLastAccessTimeEventHandler fail", err);
    });
}
function initChatsLog() {
    let chatsLogComponent = BackendFactory_1.BackendFactory.getInstance().createChatlogs();
    chatsLogComponent.onReady = function (rooms) {
        getStore().dispatch(chatroomActions.updateChatRoom(rooms));
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = () => {
        let { chatrooms } = getStore().getState().chatroomReducer;
        chatsLogComponent.manageChatLog(chatrooms).then(chatlog => {
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
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let user_id = getStore().getState().stalkReducer.user._id;
    let { roomAccess, state } = getStore().getState().chatlogReducer;
    chatsLogComp.getUnreadMessages(user_id, roomAccess, function done(err, unreadLogs) {
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
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function* () {
        let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
        let { chatrooms } = getStore().getState().chatroomReducer;
        let room = yield chatsLogComp.checkRoomInfo(unread, chatrooms);
        if (room) {
            updateRooms(room);
        }
        let chatsLog = chatsLogComp.getChatsLog();
        getStore().dispatch({
            type: exports.STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog
        });
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let { _id } = getStore().getState().stalkReducer.user;
    let { chatrooms } = getStore().getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
const UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
exports.UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
exports.UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
const UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";
exports.updateLastAccessRoom = (room_id) => ({ type: UPDATE_LAST_ACCESS_ROOM, room_id });
const updateLastAccessRoomSuccess = (payload) => ({ type: exports.UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload });
const updateLastAccessRoomFailure = (error) => ({ type: exports.UPDATE_LAST_ACCESS_ROOM_FAILURE, error });
exports.updateLastAccessRoomCancelled = () => ({ type: UPDATE_LAST_ACCESS_ROOM_CANCELLED });
exports.updateLastAccessRoomEpic = action$ => action$.ofType(UPDATE_LAST_ACCESS_ROOM).mergeMap(action => {
    let token = getStore().getState().authReducer.token;
    return ServiceProvider.updateLastAccessRoomInfo(token, action.payload);
}).map(response => updateLastAccessRoomSuccess(response.xhr.response)).do(x => {
    if (x.payload.success) {
        BackendFactory_1.BackendFactory.getInstance().dataListener.onUpdatedLastAccessTime(x.payload.result);
    }
})
    .takeUntil(action$.ofType(UPDATE_LAST_ACCESS_ROOM_CANCELLED))
    .catch(error => Rx.Observable.of(updateLastAccessRoomFailure(error.xhr.response)));
function updateRooms(room) {
    return __awaiter(this, void 0, void 0, function* () {
        let { chatrooms } = getStore().getState().chatroomReducer;
        if (Array.isArray(chatrooms) && chatrooms.length > 0) {
            chatrooms.forEach(v => {
                if (v._id == room._id) {
                    v = room;
                }
            });
            let id = chatrooms.indexOf(room);
            if (id < 0) {
                chatrooms.push(room);
            }
        }
        else {
            chatrooms = new Array();
            chatrooms.push(room);
        }
        getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
    });
}
