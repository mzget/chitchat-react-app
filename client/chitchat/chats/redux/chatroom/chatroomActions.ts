/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
import * as R from "ramda";
import { Store } from "redux";
import { createAction } from "redux-actions";
import { Utils, ChatEvents, IDictionary } from "stalk-js";
import { ServerEventListener } from "../../ServerEventListener";

import * as chatroomService from "../../services/chatroomService";
import * as MessageService from "../../services/MessageService";
import { ChatRoomComponent, ON_MESSAGE_CHANGE } from "../../ChatRoomComponent";
import { BackendFactory } from "../../BackendFactory";
import { SecureServiceFactory } from "../../secure/secureServiceFactory";

import * as NotificationManager from "../stalkBridge/StalkNotificationActions";

import { updateLastAccessRoom } from "../chatlogs/chatlogRxActions";
import { updateMessagesRead } from "./chatroomRxEpic";

import { Room, RoomType, IMember } from "../../models/Room";
import { MessageType, IMessage } from "../../../shared/Message";
import { MessageImp } from "../../models/MessageImp";
import { MemberImp } from "../../models/MemberImp";

import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store as Store<any>;
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;
const appReducer = () => ChitChatFactory.getInstance().appStore;

/**
 * ChatRoomActionsType
 */
export class ChatRoomActionsType {
    static REPLACE_MESSAGE = "REPLACE_MESSAGE";
    static ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
}

export function initChatRoom(currentRoom: Room) {
    if (!currentRoom) { throw new Error("Empty roomInfo"); }

    let room_name = currentRoom.name;
    if (!room_name && currentRoom.type === RoomType.privateChat) {
        currentRoom.members.some((v, id, arr) => {
            if (v._id !== authReducer().user._id) {
                currentRoom.name = v.username;
                return true;
            }
        });
    }

    let chatroomComp = ChatRoomComponent.createInstance();
    chatroomComp.setRoomId(currentRoom._id);

    NotificationManager.unsubscribeGlobalNotifyMessageEvent();

    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}

function onChatRoomDelegate(event, data: MessageImp | Array<MessageImp>) {
    if (event === ChatEvents.ON_CHAT) {
        let messageImp = data as MessageImp;
        let backendFactory = BackendFactory.getInstance();
        /**
         * Todo **
         * - if message_id is mine. Do nothing...
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (authReducer().user._id == messageImp.sender) {
            // dispatch(replaceMyMessage(newMsg));
            console.log("is my message");
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            let appState = appReducer().appState;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    MessageService.updateMessageReader(messageImp._id, messageImp.rid)
                        .then(response => response.json())
                        .then(value => {
                            console.log("updateMessageReader: ", value);
                        }).catch(err => {
                            console.warn("updateMessageReader: ", err);
                        });
                }
                else if (appState !== "active") {
                    // @ When user joined room but appState is inActive.
                    // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                    console.warn("Call local notification here...");
                }
            }
        }
    }
    else if (event === ON_MESSAGE_CHANGE) {
        getStore().dispatch(onMessageChangedAction(data as Array<MessageImp>));
    }
}
function onOutSideRoomDelegate(event, data) {
    if (event === ChatEvents.ON_CHAT) {
        console.log("Call notification here...", data); // active, background, inactive
        NotificationManager.notify(data);
    }
}

export const ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
const onMessageChangedAction = createAction(ON_MESSAGE_CHANGED, (messages: Array<MessageImp>) => messages);

const onEarlyMessageReady = (data: boolean) => ({ type: ChatRoomActionsType.ON_EARLY_MESSAGE_READY, payload: data });
export function checkOlderMessages() {
    return dispatch => {
        let room = getStore().getState().chatroomReducer.room;

        ChatRoomComponent.getInstance().getTopEdgeMessageTime().then(res => {
            chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
                .then(response => response.json())
                .then((result: any) => {
                    console.log("getEarlyMessagesCount", result);
                    if (result.success && result.result > 0) {
                        //               console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                        dispatch(onEarlyMessageReady(true));
                    }
                    else {
                        //                console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                        dispatch(onEarlyMessageReady(false));
                    }
                }).catch(err => {
                    console.warn("getEarlyMessagesCount fail", err);
                    dispatch(onEarlyMessageReady(false));
                });
        });
    };
}

export const LOAD_EARLY_MESSAGE = "LOAD_EARLY_MESSAGE";
export const LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
const loadEarlyMessage = createAction(LOAD_EARLY_MESSAGE, payload => payload);
const loadEarlyMessage_success = (payload) => ({ type: LOAD_EARLY_MESSAGE_SUCCESS, payload });
export function loadEarlyMessageChunk(room_id: string) {
    return dispatch => {
        dispatch(loadEarlyMessage(room_id));

        let chatroom = ChatRoomComponent.getInstance();
        chatroom.getOlderMessageChunk(room_id).then(docs => {
            chatroom.decryptMessage(docs).then(messages => {
                dispatch(loadEarlyMessage_success(messages));

                // @check older message again.
                dispatch(checkOlderMessages());
            });

            //# update messages read.
            if (docs.length > 0) {
                dispatch(updateMessagesRead(docs as Array<MessageImp>, room_id));
            }
        }).catch(err => {
            console.warn("loadEarlyMessageChunk fail", err);
        });
    };
}

export const GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
export const GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
export const GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
const getNewerMessage = createAction(GET_NEWER_MESSAGE);
const getNewerMessage_failure = createAction(GET_NEWER_MESSAGE_FAILURE);
const getNewerMessage_success = createAction(GET_NEWER_MESSAGE_SUCCESS, messages => messages);
export function getNewerMessageFromNet() {
    return dispatch => {
        dispatch(getNewerMessage());

        let token = authReducer().chitchat_token;
        let chatroom = ChatRoomComponent.getInstance();
        chatroom.getNewerMessageRecord(token, (results, room_id: string) => {
            chatroom.decryptMessage(results).then(messages => {
                dispatch(getNewerMessage_success(messages));
            });

            //# update messages read.
            if (results.length > 0) {
                dispatch(updateMessagesRead(results as Array<MessageImp>, room_id));
            }
        }).catch(err => {
            if (err) console.warn("getNewerMessageRecord fail", err);
            dispatch(getNewerMessage_failure());
        });
    };
}

export async function getMessages() {
    let chatroomComp = ChatRoomComponent.getInstance();
    let messages = await chatroomComp.getMessages();

    return messages;
}

const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
const send_message_request = () => ({ type: SEND_MESSAGE_REQUEST });
const send_message_success = (data: any) => ({ type: SEND_MESSAGE_SUCCESS, payload: data });
const send_message_failure = (error?: any) => ({ type: SEND_MESSAGE_FAILURE, payload: error });
export function sendMessage(message: IMessage) {
    return (dispatch) => {
        dispatch(send_message_request());

        if (message.type === MessageType[MessageType.Text] && getConfig().appConfig.encryption === true) {
            const secure = SecureServiceFactory.getService();
            secure.encryption(message.body)
                .then(result => {
                    message.body = result;

                    let backendFactory = BackendFactory.getInstance();
                    let chatApi = backendFactory.getServer().getChatRoomAPI();
                    chatApi.pushByUids({ data: message } as any).then((result: any) => {
                        if (result.code !== 200) {
                            dispatch(sendMessageResponse(result, null));
                        }
                        else {
                            dispatch(sendMessageResponse(null, result));
                        }
                    }).catch(err => {
                        dispatch(sendMessageResponse(err, null));
                    });
                }).catch(err => {
                    console.error(err);
                    dispatch(send_message_failure(err));
                });
        }
        else {
            let backendFactory = BackendFactory.getInstance();
            let chatApi = backendFactory.getServer().getChatRoomAPI();
            chatApi.pushByUids({ data: message } as any).then((result: any) => {
                if (result.code !== 200) {
                    dispatch(sendMessageResponse(result, null));
                }
                else {
                    dispatch(sendMessageResponse(null, result));
                }
            }).catch(err => {
                dispatch(sendMessageResponse(err, null));
            });
        }
    };
}

function sendMessageResponse(err, res) {
    return dispatch => {
        console.log("sendMessageResponse!", err, res);
        if (!!err) {
            dispatch(send_message_failure(err.message));
        }
        else {
            let chatroomComp = ChatRoomComponent.getInstance();

            if (res.code == Utils.statusCode.success && res.data.hasOwnProperty("resultMsg")) {
                let _msg = { ...res.data.resultMsg } as IMessage;
                if (_msg.type === MessageType[MessageType.Text] && getConfig().appConfig.encryption) {
                    const secure = SecureServiceFactory.getService();
                    secure.decryption(_msg.body).then(res => {
                        _msg.body = res;
                        chatroomComp.saveToPersisted(_msg as MessageImp);
                        dispatch(send_message_success(_msg));
                    }).catch(err => {
                        _msg.body = err.toString();
                        chatroomComp.saveToPersisted(_msg as MessageImp);
                        dispatch(send_message_success(_msg));
                    });
                }
                else {
                    chatroomComp.saveToPersisted(_msg as MessageImp);
                    dispatch(send_message_success(_msg));
                }
            }
            else {
                dispatch(send_message_failure(res.message));
            }
        }
    };
}

const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export const JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
const joinRoom_request = () => ({ type: JOIN_ROOM_REQUEST });
const joinRoom_success = (data?: any) => ({ type: JOIN_ROOM_SUCCESS, payload: data });
const joinRoom_failure = (error) => ({ type: JOIN_ROOM_FAILURE, payload: error });
export function joinRoom(roomId: string, token: string, username: string) {
    return (dispatch) => {
        dispatch(joinRoom_request());

        try {
            let backendFactory = BackendFactory.getInstance();
            let server = backendFactory.getServer();
            server.getLobby().joinRoom(token, username, roomId, (err, res) => {
                console.log("JoinChatRoomRequest value", res);

                if (err || res.code !== Utils.statusCode.success) {
                    dispatch(joinRoom_failure(err));
                }
                else {
                    dispatch(joinRoom_success());
                }
            });
        } catch (ex) {
            dispatch(joinRoom_failure(ex.message));
        }
    };
}

export const LEAVE_ROOM = "LEAVE_ROOM";
export const LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
const leaveRoom = () => ({ type: LEAVE_ROOM });
const leaveRoomSuccess = () => ({ type: LEAVE_ROOM_SUCCESS });
export function leaveRoomAction() {
    return (dispatch) => {
        let _room = getStore().getState().chatroomReducer.get("room");
        if (!!_room) {
            let token = getStore().getState().stalkReducer.stalkToken;
            let room_id = _room._id;
            ChatRoomComponent.getInstance().dispose();
            NotificationManager.regisNotifyNewMessageEvent();
            dispatch(updateLastAccessRoom(room_id));

            dispatch(leaveRoom());
        }
        else {
            dispatch(leaveRoom());
        }
    };
}

export const DISABLE_CHATROOM = "DISABLE_CHATROOM";
export const ENABLE_CHATROOM = "ENABLE_CHATROOM";
export const disableChatRoom = () => ({ type: DISABLE_CHATROOM });
export const enableChatRoom = () => ({ type: ENABLE_CHATROOM });

export const GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
const GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
export const GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
export const GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
const getPersistChatroomFail = () => ({ type: GET_PERSISTEND_CHATROOM_FAILURE });
const getPersistChatroomSuccess = (roomInfo: Room) => ({ type: GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo });
export const getPersistendChatroom = (roomId: string) => (dispatch => {
    dispatch({ type: GET_PERSISTEND_CHATROOM, payload: roomId });

    const { chatrooms }: { chatrooms: Array<Room> } = getStore().getState().chatroomReducer;
    if (!chatrooms) {
        return dispatch(getPersistChatroomFail());
    }

    const rooms = chatrooms.filter((room, index, array) => {
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
});

export const getRoom = (room_id: string) => {
    let { chatrooms }: { chatrooms: Array<Room> } = getStore().getState().chatroomReducer;

    if (!chatrooms) { return null; }

    const rooms = chatrooms.filter((room, index, array) => {
        if (room._id.toString() == room_id) {
            return room;
        }
    });

    return rooms[0];
};

export const createChatRoom = (myUser, contactUser) => {
    if (myUser && contactUser) {
        let owner = {} as IMember;
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = `${myUser.firstname} ${myUser.lastname}`;

        let contact = {} as IMember;
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = `${contactUser.firstname} ${contactUser.lastname}`;

        let members = { owner, contact };

        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");

        return null;
    }
};

export const UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
export const updatedChatRoomSuccess = (chatrooms: Array<Room>) => ({ type: UPDATED_CHATROOMS, payload: chatrooms });
export const updateChatRoom = (rooms: Array<Room>) => {
    return dispatch => {
        let chatrooms: Array<Room> = getStore().getState().chatroomReducer.get("chatrooms");
        if (chatrooms) {
            // R.unionWith(R.eqBy(R.prop('a')), l1, l2);
            let _newRooms = R.unionWith(R.eqBy(R.prop("_id")), rooms, chatrooms) as Array<Room>;
            dispatch(updatedChatRoomSuccess(_newRooms));
        }
        else {
            chatrooms = rooms.slice();

            dispatch(updatedChatRoomSuccess(chatrooms));
        }
    };
};

const GET_CHAT_TARGET_UID = "GET_CHAT_TARGET_UID";
export const GET_CHAT_TARGET_UID_SUCCESS = "GET_CHAT_TARGET_UID_SUCCESS";
export const GET_CHAT_TARGET_UID_FAILURE = "GET_CHAT_TARGET_UID_FAILURE";
const getChatTargetId = createAction(GET_CHAT_TARGET_UID, (room_id: string) => room_id);
const getChatTargetIdSuccess = createAction(GET_CHAT_TARGET_UID_SUCCESS, (payload) => payload);
const getChatTargetIdFailure = createAction(GET_CHAT_TARGET_UID_FAILURE, (error) => error);
export function getChatTargetIds(room_id: string) {
    return dispatch => {
        dispatch(getChatTargetId(room_id));

        let { room }: { room: Room } = getStore().getState().chatroomReducer;
        let { _id } = authReducer().user;
        if (!room) {
            dispatch(getChatTargetIdFailure("Has no room object!"));
        }
        else {
            let results = new Array<string>();
            room.members.map(value => (value._id != _id) ? results.push(value._id) : null);

            dispatch(getChatTargetIdSuccess(results));
        }
    }
}