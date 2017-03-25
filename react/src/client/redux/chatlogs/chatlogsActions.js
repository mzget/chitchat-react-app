"use strict";
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const BackendFactory_1 = require("../../chats/BackendFactory");
const chatslogComponent_1 = require("../../chats/chatslogComponent");
const ServiceProvider = require("../../chats/services/ServiceProvider");
const configureStore_1 = require("../configureStore");
const chatsLogComp = () => configureStore_1.default.getState().chatlogReducer.chatslogComponent;
exports.STALK_INIT_CHATSLOG = "STALK_INIT_CHATSLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_UNREAD_MAP_CHANGED = "STALK_UNREAD_MAP_CHANGED";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
const listenerImp = (newMsg) => {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp().increaseChatsLogCount(1);
        let unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp().getUnreadItem(newMsg.rid)) ? chatsLogComp().getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp().addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
    }
};
function updateLastAccessTimeEventHandler(newRoomAccess) {
    let user_id = configureStore_1.default.getState().userReducer.user._id;
    chatsLogComp().getUnreadMessage(user_id, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp().addUnreadMessage(unread);
            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
        }
    });
}
function initChatsLog() {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let chatsLogComponent = new chatslogComponent_1.default();
    dataManager.contactsProfileChanged = (contact) => {
        chatsLogComponent.getRoomsInfo();
    };
    chatsLogComponent.onReady = function () {
        getUnreadMessages();
        chatsLogComponent.onReady = null;
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
    configureStore_1.default.dispatch({
        type: exports.STALK_INIT_CHATSLOG, payload: chatsLogComponent
    });
}
exports.initChatsLog = initChatsLog;
function getUnreadMessages() {
    let dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
    let user_id = configureStore_1.default.getState().userReducer.user._id;
    chatsLogComp().getUnreadMessages(user_id, dataManager.getRoomAccess(), function done(err, unreadLogs) {
        if (!!unreadLogs) {
            unreadLogs.map(function element(unread) {
                chatsLogComp().addUnreadMessage(unread);
            });
            calculateUnreadCount();
        }
        getUnreadMessageComplete();
    });
}
function calculateUnreadCount() {
    chatsLogComp().calculateChatsLogCount();
}
function increaseLogsCount(count) {
    chatsLogComp().increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    chatsLogComp().decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    return chatsLogComp ? chatsLogComp().getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    return chatsLogComp().getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLog = chatsLogComp().getChatsLog();
    configureStore_1.default.dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    configureStore_1.default.dispatch({
        type: exports.STALK_UNREAD_MAP_CHANGED, payload: unread
    });
    chatsLogComp().checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp().getChatsLog();
        configureStore_1.default.dispatch({
            type: exports.STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}
function getUnreadMessageComplete() {
    chatsLogComp().getRoomsInfo();
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
function getLastAccessRoom() {
    return dispatch => {
        let token = configureStore_1.default.getState().authReducer.token;
        ServiceProvider.getLastAccessRoomInfo(token).then(response => response.json())
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
