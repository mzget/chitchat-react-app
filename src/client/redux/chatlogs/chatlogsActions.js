import BackendFactory from "../../chats/BackendFactory";
import ChatsLogComponent, { Unread } from "../../chats/chatslogComponent";
import Store from "../configureStore";
export const STALK_INIT_CHATSLOG = 'STALK_INIT_CHATSLOG';
export const STALK_GET_CHATSLOG_COMPLETE = 'STALK_GET_CHATSLOG_COMPLETE';
export const STALK_UNREAD_MAP_CHANGED = 'STALK_UNREAD_MAP_CHANGED';
export const STALK_CHATSLOG_CONTACT_COMPLETE = 'STALK_CHATSLOG_CONTACT_COMPLETE';
const listenerImp = (newMsg) => {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    let dataManager = BackendFactory.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp.increaseChatsLogCount(1);
        console.warn("room to add: ", JSON.stringify(chatsLogComp.getUnreadItem(newMsg.rid)));
        let unread = new Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp.getUnreadItem(newMsg.rid)) ? chatsLogComp.getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp.addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
    }
};
export function initChatsLog() {
    if (!Store.getState().stalkReducer.isInit) {
        let dataManager = BackendFactory.getInstance().dataManager;
        let chatsLogComponent = new ChatsLogComponent();
        dataManager.contactsProfileChanged = (contact) => {
            chatsLogComponent.getRoomsInfo();
        };
        chatsLogComponent.onReady = function () {
            getUnreadMessages();
            chatsLogComponent.onReady = null;
        };
        chatsLogComponent.getRoomsInfoCompleteEvent = () => {
            getChatsLog();
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
        BackendFactory.getInstance().getServer().then(server => {
            server.getLastAccessRoomsInfo(msg, function (err, res) {
                console.log("getLastAccessRoomsInfo:", JSON.stringify(res));
            });
        }).catch(err => {
            console.warn("Cannot getLastAccessRoomsInfo", err);
        });
        Store.dispatch({
            type: STALK_INIT_CHATSLOG, payload: chatsLogComponent
        });
    }
}
function updateLastAccessTimeEventHandler(newRoomAccess) {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    let token = Store.getState().authReducer.token;
    chatsLogComp.getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp.addUnreadMessage(unread);
            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
        }
    });
}
function getUnreadMessages() {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    let dataManager = BackendFactory.getInstance().dataManager;
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
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.decreaseChatsLogCount(count);
}
export function getChatsLogCount() {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
function getUnreadMessageMap() {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    let chatsLog = chatsLogComp.getChatsLog();
    Store.dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}
function onUnreadMessageMapChanged(unread) {
    console.log('UnreadMessageMapChanged: ', JSON.stringify(unread));
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp.getChatsLog();
        Store.dispatch({
            type: STALK_UNREAD_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = Store.getState().stalkReducer.chatslogComponent;
    chatsLogComp.getRoomsInfo();
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    let dataManager = BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value.id);
    });
    return (contacts.length > 0) ? contacts[0].id : null;
};
