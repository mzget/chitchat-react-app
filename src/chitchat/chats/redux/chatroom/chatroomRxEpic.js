/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import * as Rx from "rxjs/Rx";
import { createAction } from "redux-actions";
const { ajax, fromPromise } = Rx.Observable;
import { ChatRoomComponent } from "../../ChatRoomComponent";
import { ChitChatFactory } from "../../ChitchatFactory";
import { checkOlderMessages, getNewerMessageFromNet } from "./chatroomActions";
import * as chatroomService from "../../services/chatroomService";
import { updateMessagesReader } from "../../services/MessageService";
const getConfig = () => ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory.getInstance().store;
const authReducer = () => ChitChatFactory.getInstance().authStore;
export const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
export const fetchPrivateChatRoom = (ownerId, roommateId) => ({ type: FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload });
export const getPrivateChatRoom_Epic = action$ => action$.ofType(FETCH_PRIVATE_CHATROOM)
    .mergeMap(action => fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId)))
    .mergeMap(response => fromPromise(response.json()))
    .map(json => {
    if (json.success) {
        return fetchPrivateChatRoomSuccess(json.result[0]);
    }
    else {
        return fetchPrivateChatRoomFailure(json.message);
    }
})._do(x => {
    if (x.type == FETCH_PRIVATE_CHATROOM_FAILURE) {
        console.warn("Need to create private chat room!");
    }
})
    .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
    .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)));
export const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export const CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
export const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
export const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
export const createPrivateChatRoom = (owner, roommate) => ({ type: CREATE_PRIVATE_CHATROOM, payload: { owner, roommate } });
const createPrivateChatRoomSuccess = (payload) => ({ type: CREATE_PRIVATE_CHATROOM_SUCCESS, payload });
const createPrivateRoomCancelled = () => ({ type: CREATE_PRIVATE_CHATROOM_CANCELLED });
const createPrivateChatRoomFailure = (payload) => ({ type: CREATE_PRIVATE_CHATROOM_FAILURE, payload });
export const createPrivateChatRoomEpic = action$ => {
    return action$.ofType(CREATE_PRIVATE_CHATROOM)
        .mergeMap(action => ajax({
        method: "POST",
        url: `${getConfig().api.group}/private_chat/create`,
        body: action.payload,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": authReducer().chitchat_token
        }
    }))
        .map(json => createPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)));
};
const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
export const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
export const getPersistendMessage = (currentRid) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: GET_PERSISTEND_MESSAGE_SUCCESS, payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
export const getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => ChatRoomComponent.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)))
        ._do(x => {
        getStore().dispatch(checkOlderMessages());
        getStore().dispatch(getNewerMessageFromNet());
    });
};
export const UPDATE_MESSAGES_READ = "UPDATE_MESSAGES_READ";
export const UPDATE_MESSAGES_READ_SUCCESS = "UPDATE_MESSAGES_READ_SUCCESS";
export const UPDATE_MESSAGES_READ_FAILUER = "UPDATE_MESSAGES_READ_FAILURE";
export const updateMessagesRead = createAction(UPDATE_MESSAGES_READ, (messages, room_id) => ({ messages, room_id }));
export const updateMessagesRead_Success = createAction(UPDATE_MESSAGES_READ_SUCCESS, payload => payload);
export const updateMessagesRead_Failure = createAction(UPDATE_MESSAGES_READ_FAILUER, payload => payload);
export const updateMessagesRead_Epic = (action$) => {
    return action$.ofType(UPDATE_MESSAGES_READ)
        .mergeMap((action) => {
        let messages = action.payload.messages;
        let updates = messages.map((value) => {
            if (value.sender != authReducer().user._id) {
                return value._id;
            }
        });
        return updateMessagesReader(updates, action.payload.room_id);
    })
        .mergeMap(response => response.json())
        .map((json) => {
        if (json.success) {
            return updateMessagesRead_Success(json);
        }
        else {
            return updateMessagesRead_Failure(json.message);
        }
    })
        .catch(error => Rx.Observable.of(updateMessagesRead_Failure(error)));
};
export const CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
export const CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
export const CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
export const CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
export const uploadFile = (progressEvent, file) => ({
    type: CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file }
});
const uploadFileSuccess = (result) => ({ type: CHATROOM_UPLOAD_FILE_SUCCESS, payload: result.result });
const uploadFileFailure = (error) => ({ type: CHATROOM_UPLOAD_FILE_FAILURE, payload: error });
export const uploadFileCanceled = () => ({ type: CHATROOM_UPLOAD_FILE_CANCELLED });
export const uploadFileEpic = action$ => (action$.ofType(CHATROOM_UPLOAD_FILE)
    .mergeMap(action => {
    let body = new FormData();
    body.append("file", action.payload.file);
    return ajax({
        method: "POST",
        url: `${getConfig().api.fileUpload}`,
        body: body,
        headers: {}
    });
})
    .map(json => uploadFileSuccess(json.response))
    .takeUntil(action$.ofType(CHATROOM_UPLOAD_FILE_CANCELLED))
    .catch(error => Rx.Observable.of(uploadFileFailure(error.xhr.response))));
