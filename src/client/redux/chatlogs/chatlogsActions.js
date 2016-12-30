"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const chatslogComponent_1 = require("../../chats/chatslogComponent");
const configureStore_1 = require("../configureStore");
exports.STALK_INIT_CHATSLOG = 'STALK_INIT_CHATSLOG';
exports.STALK_GET_CHATSLOG_COMPLETE = 'STALK_GET_CHATSLOG_COMPLETE';
exports.STALK_UNREAD_MAP_CHANGED = 'STALK_UNREAD_MAP_CHANGED';
exports.STALK_CHATLOG_MAP_CHANGED = 'STALK_CHATLOG_MAP_CHANGED';
exports.STALK_CHATLOG_CONTACT_COMPLETE = 'STALK_CHATLOG_CONTACT_COMPLETE';
const listenerImp = (newMsg) => {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        console.log("room to add: ", dataManager.getGroup(newMsg.rid));
        let unread = new chatslogComponent_1.Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        configureStore_1.default.dispatch({
            type: exports.STALK_UNREAD_MAP_CHANGED, payload: unread
        });
        onUnreadMessageMapChanged(unread);
    }
};
function initChatsLog() {
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
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
    chatsLogComponent.onEditedGroupMember = function (newgroup) {
        console.log('onEditedGroupMember: ', JSON.stringify(newgroup));
        // $rootScope.$broadcast('onEditedGroupMember', []);
    };
    let msg = {};
    msg["token"] = dataManager.getSessionToken();
    BackendFactory_1.default.getInstance().getServer().then(server => {
        server.getLastAccessRoomsInfo(msg, function (err, res) {
            console.log("getLastAccessRoomsInfo:", JSON.stringify(res));
        });
    }).catch(err => {
        console.warn("Cannot getLastAccessRoomsInfo", err);
    });
    configureStore_1.default.dispatch({
        type: exports.STALK_INIT_CHATSLOG, payload: chatsLogComponent
    });
}
exports.initChatsLog = initChatsLog;
function updateLastAccessTimeEventHandler(newRoomAccess) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let token = BackendFactory_1.default.getInstance().dataManager.getSessionToken();
    chatsLogComp.getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp.addUnreadMessage(unread);
            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
        }
    });
}
function getUnreadMessages() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    let token = dataManager.getSessionToken();
    chatsLogComp.getUnreadMessages(token, dataManager.getRoomAccess(), function done(err, unreadLogs) {
        if (!!unreadLogs) {
            unreadLogs.map(function element(unread) {
                chatsLogComp.addUnreadMessage(unread);
            });
            calculateUnreadCount();
        }
        getUnreadMessageComplete();
    });
}
function calculateUnreadCount() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    let chatsLog = chatsLogComp.getChatsLog();
    configureStore_1.default.dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    console.log('UnreadMessageMapChanged: ', JSON.stringify(unread));
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
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
    let chatsLogComp = configureStore_1.default.getState().stalkReducer.chatslogComponent;
    chatsLogComp.getRoomsInfo();
}
const getChatLogContact = (chatlog) => {
    let dataManager = BackendFactory_1.default.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value.id);
    });
    return (contacts.length > 0) ? contacts[0].id : null;
};
