/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import * as async from "async";

import BackendFactory from "../../chats/BackendFactory";
import ChatsLogComponent, { ChatLogMap, IUnread, Unread } from "../../chats/chatslogComponent";
import ChatLog from "../../chats/models/chatLog";
import StalkImp, { IDictionary } from "../../libs/stalk/serverImplemented";
import * as ServiceProvider from "../../chats/services/ServiceProvider";

import Store from "../configureStore";
const chatsLogComp = () => Store.getState().chatlogReducer.chatslogComponent as ChatsLogComponent;

export const STALK_INIT_CHATSLOG = "STALK_INIT_CHATSLOG";
export const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export const STALK_UNREAD_MAP_CHANGED = "STALK_UNREAD_MAP_CHANGED";
export const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";

const listenerImp = (newMsg) => {
    let dataManager = BackendFactory.getInstance().dataManager;

    if (!dataManager.isMySelf(newMsg.sender)) {
        chatsLogComp().increaseChatsLogCount(1);

        let unread: IUnread = new Unread();
        unread.message = newMsg;
        unread.rid = newMsg.rid;
        let count = (!!chatsLogComp().getUnreadItem(newMsg.rid)) ? chatsLogComp().getUnreadItem(newMsg.rid).count : 0;
        count++;
        unread.count = count;
        chatsLogComp().addUnreadMessage(unread);
        onUnreadMessageMapChanged(unread);
        //             chatLogDAL.savePersistedUnreadMsgMap(unread);
    }
};

function updateLastAccessTimeEventHandler(newRoomAccess) {
    let token = Store.getState().authReducer.token;
    chatsLogComp().getUnreadMessage(token, newRoomAccess.roomAccess[0], function (err, unread) {
        if (!!unread) {
            chatsLogComp().addUnreadMessage(unread);

            calculateUnreadCount();
            onUnreadMessageMapChanged(unread);
            //chatLogDAL.savePersistedUnreadMsgMap(unread);
        }
    });
}

export function initChatsLog() {
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
        chatsLogComponent.manageChatLog().then(chatlog => {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = function (data) {
        getUnreadMessages();
    };

    Store.dispatch({
        type: STALK_INIT_CHATSLOG, payload: chatsLogComponent
    });
}

function getUnreadMessages() {
    let dataManager = BackendFactory.getInstance().dataManager;
    let token = Store.getState().authReducer.token;
    chatsLogComp().getUnreadMessages(token, dataManager.getRoomAccess(), function done(err, unreadLogs) {
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

function increaseLogsCount(count: number) {
    chatsLogComp().increaseChatsLogCount(count);
}

function decreaseLogsCount(count: number) {
    chatsLogComp().decreaseChatsLogCount(count);
}

export function getChatsLogCount() {
    return chatsLogComp ? chatsLogComp().getChatsLogCount() : null;
}

function getUnreadMessageMap() {
    return chatsLogComp().getUnreadMessageMap();
}

function getChatsLog() {
    let chatsLog = chatsLogComp().getChatsLog();

    Store.dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog
    });
}

function onUnreadMessageMapChanged(unread: IUnread) {
    Store.dispatch({
        type: STALK_UNREAD_MAP_CHANGED, payload: unread
    });

    chatsLogComp().checkRoomInfo(unread).then(function () {
        let chatsLog = chatsLogComp().getChatsLog();
        Store.dispatch({
            type: STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog
        });
    }).catch(function () {
        console.warn("Cannot get roomInfo of ", unread.rid);
    });
}

function getUnreadMessageComplete() {
    chatsLogComp().getRoomsInfo();
}

const getChatLogContact = (chatlog: ChatLog) => {
    let dataManager = BackendFactory.getInstance().dataManager;
    let contacts = chatlog.room.members.filter(value => {
        return !dataManager.isMySelf(value.id);
    });

    return (contacts.length > 0) ? contacts[0].id : null;
};

export const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
const getLastAccessRoomSuccess = (payload) => ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (error) => ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: error });
export function getLastAccessRoom() {
    return dispatch => {
        let token = Store.getState().authReducer.token;

        ServiceProvider.getLastAccessRoomInfo(token).then(response => response.json())
            .then(json => {
                if (json.success) {
                    dispatch(getLastAccessRoomSuccess(json.result));

                    BackendFactory.getInstance().dataListener.onAccessRoom(json.result);
                }
                else {
                    dispatch(getLastAccessRoomFailure(json.message));
                }
            }).catch(err => {
                dispatch(getLastAccessRoomFailure(err));
            });
    };
}