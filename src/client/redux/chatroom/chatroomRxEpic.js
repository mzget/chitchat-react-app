/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import ChatRoomComponent from "../../chats/chatRoomComponent";
import * as chatroomActions from "./chatroomActions";
import { ChatRoomActionsType } from "./chatroomActions";
import config from "../../configs/config";
import { Record } from "immutable";
import { createAction } from 'redux-actions';
const Rx = require('rxjs/Rx');
const { ajax } = Rx.Observable;
const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
export const fetchPrivateChatRoom = createAction(FETCH_PRIVATE_CHATROOM, (ownerId, roommateId) => ({ ownerId, roommateId }));
const fetchPrivateChatRoomSuccess = (payload) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload, error: true });
export const getPrivateChatRoomEpic = action$ => {
    return action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap(action => ajax.post(`${config.api.chatroom}/`, action.payload))
        .map(json => fetchPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.xhr.response)));
};
const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
const getPersistendMessage_cancel = createAction(GET_PERSISTEND_MESSAGE_CANCELLED);
const getPersistendMessage_success = createAction(GET_PERSISTEND_MESSAGE_SUCCESS, payload => payload);
const getPersistendMessage_failure = createAction(GET_PERSISTEND_MESSAGE_FAILURE);
export const getPersistendMessage = (currentRid) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
export const getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => ChatRoomComponent.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)));
    //@ Next call 2 method below. -->
    //getNewerMessageFromNet();
    //checkOlderMessages();
};
export const ChatRoomInitState = Record({
    isFetching: false,
    state: null,
    room: null,
    responseMessage: null,
    newMessage: null
});
export const chatroomReducer = (state = new ChatRoomInitState(), action) => {
    switch (action.type) {
        case FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload.result[0])
                .set("state", FETCH_PRIVATE_CHATROOM_SUCCESS);
        case FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state;
        case FETCH_PRIVATE_CHATROOM_FAILURE:
            return state;
        case ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            return state
                .set("state", chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS)
                .set("room", action.payload);
        }
        case chatroomActions.LEAVE_ROOM_SUCCESS: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM_SUCCESS)
                .set("room", null);
        }
        case ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        default:
            return state;
    }
};
