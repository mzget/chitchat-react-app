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
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const BackendFactory_1 = require("../../BackendFactory");
const chatslogComponent_1 = require("../../chatslogComponent");
const ServiceProvider = require("../../services/ServiceProvider");
const configureStore_1 = require("../../../redux/configureStore");
exports.STALK_INIT_CHATSLOG = "STALK_INIT_CHATSLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
exports.STALK_CHATROOMS_READY = "STALK_CHATROOMS_READY";
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
    let user_id = configureStore_1.default.getState().userReducer.user._id;
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
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let chatsLogComponent = BackendFactory_1.BackendFactory.getInstance().createChatlogs();
    chatsLogComponent.onReady = function (rooms) {
        configureStore_1.default.dispatch({ type: exports.STALK_CHATROOMS_READY, payload: rooms });
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = () => {
        chatsLogComponent.manageChatLog().then(chatlog => {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = function (data) {
        getUnreadMessages();
    };
    configureStore_1.default.dispatch({ type: exports.STALK_INIT_CHATSLOG });
}
exports.initChatsLog = initChatsLog;
function getUnreadMessages() {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let user_id = configureStore_1.default.getState().userReducer.user._id;
    let { roomAccess, state } = configureStore_1.default.getState().chatlogReducer;
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
    configureStore_1.default.dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    chatsLogComp.checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp.getChatsLog();
        configureStore_1.default.dispatch({
            type: exports.STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = BackendFactory_1.BackendFactory.getInstance().chatLogComp;
    let { _id } = configureStore_1.default.getState().userReducer.user;
    let { chatrooms } = configureStore_1.default.getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value.id);
    });
    return (contacts.length > 0) ? contacts[0].id : null;
};
exports.GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
exports.GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
const getLastAccessRoomSuccess = (payload) => ({ type: exports.GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (error) => ({ type: exports.GET_LAST_ACCESS_ROOM_FAILURE, payload: error });
function getLastAccessRoom(team_id) {
    return dispatch => {
        let token = configureStore_1.default.getState().authReducer.token;
        ServiceProvider.getLastAccessRoomInfo(token, team_id).then(response => response.json())
            .then(json => {
            if (json.success) {
                dispatch(getLastAccessRoomSuccess(json.result));
                BackendFactory_1.BackendFactory.getInstance().dataListener.onAccessRoom(json.result);
            }
            else {
                dispatch(getLastAccessRoomFailure(json.message));
            }
        }).catch(err => {
            dispatch(getLastAccessRoomFailure(err));
        });
    };
}
exports.getLastAccessRoom = getLastAccessRoom;
const UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
exports.UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
exports.UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
const UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";
exports.updateLastAccessRoom = redux_actions_1.createAction(UPDATE_LAST_ACCESS_ROOM, room_id => room_id);
const updateLastAccessRoomSuccess = redux_actions_1.createAction(exports.UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload => payload);
const updateLastAccessRoomFailure = redux_actions_1.createAction(exports.UPDATE_LAST_ACCESS_ROOM_FAILURE, error => error);
exports.updateLastAccessRoomCancelled = redux_actions_1.createAction(UPDATE_LAST_ACCESS_ROOM_CANCELLED);
exports.updateLastAccessRoomEpic = action$ => action$.ofType(UPDATE_LAST_ACCESS_ROOM).mergeMap(action => {
    let token = configureStore_1.default.getState().authReducer.token;
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
        let { chatrooms } = configureStore_1.default.getState().chatRoomReducer;
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
        configureStore_1.default.dispatch({ type: exports.STALK_CHATROOMS_READY, payload: chatrooms });
    });
}
