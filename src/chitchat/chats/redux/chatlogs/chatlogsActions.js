/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
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
import InternalStore from "stalk-simplechat";
import { Unread } from "stalk-simplechat";
import * as chatroomActions from "../chatroom/chatroomActions";
const getStore = () => InternalStore.store;
const authReducer = () => InternalStore.authStore;
export const STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
export const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
const listenerImp = (newMsg) => {
    const chatsLogComp = InternalStore.chatlogInstance;
    if (newMsg.sender !== authReducer().user) {
        chatsLogComp.increaseChatsLogCount(1);
        const unread = new Unread();
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
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);
    const chatsLogComp = InternalStore.chatlogInstance;
    const { _id } = authReducer().user;
    chatsLogComp.getUnreadMessage(_id, newRoomAccess).then((unread) => {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
        // chatLogDAL.savePersistedUnreadMsgMap(unread);
    }).catch((err) => {
        if (err) {
            console.warn("updateLastAccessTimeEventHandler fail", err);
        }
    });
}
export function initChatsLog() {
    const chatsLogComponent = InternalStore.createChatLogInstance();
    chatsLogComponent.onReady = (rooms) => {
        getStore().dispatch(chatroomActions.updateChatRoom(rooms));
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = () => {
        const { chatrooms } = getStore().getState().chatroomReducer;
        chatsLogComponent.manageChatLog(chatrooms).then((chatlog) => {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = (data) => {
        getUnreadMessages();
    };
    getStore().dispatch({ type: STALK_INIT_CHATLOG });
}
function getUnreadMessages() {
    const chatsLogComp = InternalStore.chatlogInstance;
    const { _id } = authReducer().user;
    const { roomAccess, state } = getStore().getState().chatlogReducer;
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
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.decreaseChatsLogCount(count);
}
export function getChatsLogCount() {
    const chatsLogComp = InternalStore.chatlogInstance;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
function getUnreadMessageMap() {
    const chatsLogComp = InternalStore.chatlogInstance;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    const chatsLogComp = InternalStore.chatlogInstance;
    const chatsLog = chatsLogComp.getChatsLog();
    const logCount = chatsLogComp.getChatsLogCount();
    getStore().dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: { chatsLog, logCount },
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatsLogComp = InternalStore.chatlogInstance;
        const { chatrooms } = getStore().getState().chatroomReducer;
        const room = yield chatsLogComp.checkRoomInfo(unread, chatrooms);
        if (room) {
            updateRooms(room);
        }
        const chatsLog = chatsLogComp.getChatsLog();
        const logCount = chatsLogComp.getChatsLogCount();
        getStore().dispatch({
            type: STALK_CHATLOG_MAP_CHANGED,
            payload: { chatsLog, logCount },
        });
    });
}
function getUnreadMessageComplete() {
    const chatsLogComp = InternalStore.chatlogInstance;
    const { _id } = authReducer().user;
    const { chatrooms } = getStore().getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    const dataManager = InternalStore.chatlogInstance;
    const contacts = chatlog.room.members.filter((value) => {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
function updateRooms(room) {
    return __awaiter(this, void 0, void 0, function* () {
        let { chatrooms } = getStore().getState().chatroomReducer;
        if (Array.isArray(chatrooms) && chatrooms.length > 0) {
            chatrooms.forEach((v) => {
                if (v._id === room._id) {
                    v = room;
                }
            });
            const id = chatrooms.indexOf(room);
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
