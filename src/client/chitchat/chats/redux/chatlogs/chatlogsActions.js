var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { BackendFactory } from "../../BackendFactory";
import { Unread } from "../../ChatslogComponent";
import * as chatroomActions from "../chatroom/chatroomActions";
import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store;
const authReducer = () => ChitChatFactory.getInstance().authStore;
export const STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
export const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
const listenerImp = (newMsg) => {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    if (newMsg.sender != authReducer().user) {
        chatsLogComp.increaseChatsLogCount(1);
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
function updateLastAccessTimeEventHandler(newRoomAccess) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    chatsLogComp.getUnreadMessage(_id, newRoomAccess).then(function (unread) {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
    }).catch(err => {
        if (err)
            console.warn("updateLastAccessTimeEventHandler fail", err);
    });
}
export function initChatsLog() {
    let chatsLogComponent = BackendFactory.getInstance().createChatlogs();
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
    getStore().dispatch({ type: STALK_INIT_CHATLOG });
}
function getUnreadMessages() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    let { roomAccess, state } = getStore().getState().chatlogReducer;
    if (roomAccess && roomAccess.length > 0) {
        chatsLogComp.getUnreadMessages(_id, roomAccess, function done(err, unreadLogs) {
            if (!!unreadLogs) {
                chatsLogComp.setUnreadMessageMap(unreadLogs);
                calculateUnreadCount();
                getUnreadMessageComplete();
            }
        });
    }
    else {
        getChatsLog();
    }
}
function calculateUnreadCount() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    chatsLogComp.decreaseChatsLogCount(count);
}
export function getChatsLogCount() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
function getUnreadMessageMap() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let chatsLog = chatsLogComp.getChatsLog();
    let logCount = chatsLogComp.getChatsLogCount();
    getStore().dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: { chatsLog, logCount }
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function* () {
        let chatsLogComp = BackendFactory.getInstance().chatLogComp;
        let { chatrooms } = getStore().getState().chatroomReducer;
        let room = yield chatsLogComp.checkRoomInfo(unread, chatrooms);
        if (room) {
            updateRooms(room);
        }
        let chatsLog = chatsLogComp.getChatsLog();
        let logCount = chatsLogComp.getChatsLogCount();
        getStore().dispatch({
            type: STALK_CHATLOG_MAP_CHANGED,
            payload: { chatsLog, logCount }
        });
    });
}
function getUnreadMessageComplete() {
    let chatsLogComp = BackendFactory.getInstance().chatLogComp;
    let { _id } = authReducer().user;
    let { chatrooms } = getStore().getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
}
const getChatLogContact = (chatlog) => {
    let dataManager = BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
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
