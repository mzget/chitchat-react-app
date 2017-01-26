/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import ChatRoomComponent from "../../chats/chatRoomComponent";
import Store from "../configureStore";
import config from "../../configs/config";

import Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;

export const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";

export const fetchPrivateChatRoom = (ownerId, roommateId) => ({ type: FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload, error: true });
export const getPrivateChatRoomEpic = action$ => {
    return action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap(action => ajax({
            url: `${config.api.chatroom}`,
            method: "POST",
            body: JSON.stringify(action.payload),
            headers: {
                "Content-Type": "application/json",
                "x-access-token": Store.getState().authReducer.token
            }
        }))
        .map(json => fetchPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.xhr.response)))
};

const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export const CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
export const createPrivateChatRoom = (owner, roommate) => ({
    type: CREATE_PRIVATE_CHATROOM, payload: { owner, roommate }
});
const createPrivateChatRoomSuccess = (payload) => ({
    type: CREATE_PRIVATE_CHATROOM_SUCCESS, payload
});
const createPrivateRoomCancelled = () => ({
    type: CREATE_PRIVATE_CHATROOM_CANCELLED
});
const createPrivateChatRoomFailure = (payload) => ({
    type: CREATE_PRIVATE_CHATROOM_FAILURE, payload
});
export const createPrivateChatRoomEpic = action$ => {
    return action$.ofType(CREATE_PRIVATE_CHATROOM)
        .mergeMap(action => ajax({
            method: 'POST',
            url: `${config.api.chatroom}/createPrivateRoom`,
            body: action.payload,
            headers: { 'Content-Type': 'application/json' }
        }))
        .map(json => createPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)))
};

const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: GET_PERSISTEND_MESSAGE_SUCCESS, payload: payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
export const getPersistendMessage = (currentRid: string) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
export const getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => ChatRoomComponent.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)))

    // Next call 2 method below. -->
    // getNewerMessageFromNet();
    // checkOlderMessages();
};

export const CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
export const CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
export const CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
export const CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";

export const uploadFile = (progressEvent: ProgressEvent, file) => ({
    type: CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file }
});
const uploadFileSuccess = (result) => ({ type: CHATROOM_UPLOAD_FILE_SUCCESS, payload: result.result });
const uploadFileFailure = (error) => ({ type: CHATROOM_UPLOAD_FILE_FAILURE, payload: error });
export const uploadFileCanceled = () => ({ type: CHATROOM_UPLOAD_FILE_CANCELLED });

export const uploadFileEpic = action$ => (
    action$.ofType(CHATROOM_UPLOAD_FILE)
        .mergeMap(action => {
            let body = new FormData();
            body.append('file', action.payload.file);

            return ajax({
                method: 'POST',
                url: `${config.api.fileUpload}`,
                body: body,
                headers: {}
            });
        })
        .map(json => uploadFileSuccess(json.response))
        .takeUntil(action$.ofType(CHATROOM_UPLOAD_FILE_CANCELLED))
        .catch(error => Rx.Observable.of(uploadFileFailure(error)))
);