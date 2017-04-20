/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import Rx = require("rxjs/Rx");
const { ajax, fromPromise } = Rx.Observable;

import ChatRoomComponent from "../../chatRoomComponent";
import { ChitChatFactory } from "../../chitchatFactory";
import * as chatroomService from "../../services/chatroomService";

const getConfig = () => ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory.getInstance().store;
const authReducer = () => ChitChatFactory.getInstance().authStore;

export const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";

export const fetchPrivateChatRoom = (ownerId: string, roommateId: string) => ({ type: FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload });
export const getPrivateChatRoom_Epic = action$ =>
    action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap(action => fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId)))
        .mergeMap(response => fromPromise(response.json()))
        .map(json => {
            console.log("getPrivateChatRoom_Epic", json);
            if (json.success) {
                return fetchPrivateChatRoomSuccess(json.result[0]);
            }
            else {
                return fetchPrivateChatRoomFailure(json.message);
            }
        })
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)));

const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export const CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
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
export const getPersistendMessage = (currentRid: string) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: GET_PERSISTEND_MESSAGE_SUCCESS, payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
export const getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => ChatRoomComponent.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)));

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
        .catch(error => Rx.Observable.of(uploadFileFailure(error.xhr.response)))
);