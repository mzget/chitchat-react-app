"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
const Rx = require("rxjs/Rx");
const { ajax, fromPromise } = Rx.Observable;
const chatRoomComponent_1 = require("../../chatRoomComponent");
const chitchatFactory_1 = require("../../chitchatFactory");
const chatroomService = require("../../services/chatroomService");
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const getStore = () => chitchatFactory_1.ChitChatFactory.getInstance().store;
const authReducer = () => chitchatFactory_1.ChitChatFactory.getInstance().authStore;
exports.FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
exports.FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
exports.FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
exports.FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
exports.fetchPrivateChatRoom = (ownerId, roommateId) => ({ type: exports.FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: exports.FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: exports.FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: exports.FETCH_PRIVATE_CHATROOM_FAILURE, payload });
exports.getPrivateChatRoom_Epic = action$ => action$.ofType(exports.FETCH_PRIVATE_CHATROOM)
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
    .takeUntil(action$.ofType(exports.FETCH_PRIVATE_CHATROOM_CANCELLED))
    .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)));
const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
exports.CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
exports.createPrivateChatRoom = (owner, roommate) => ({ type: CREATE_PRIVATE_CHATROOM, payload: { owner, roommate } });
const createPrivateChatRoomSuccess = (payload) => ({ type: exports.CREATE_PRIVATE_CHATROOM_SUCCESS, payload });
const createPrivateRoomCancelled = () => ({ type: CREATE_PRIVATE_CHATROOM_CANCELLED });
const createPrivateChatRoomFailure = (payload) => ({ type: CREATE_PRIVATE_CHATROOM_FAILURE, payload });
exports.createPrivateChatRoomEpic = action$ => {
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
exports.GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
exports.getPersistendMessage = (currentRid) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: exports.GET_PERSISTEND_MESSAGE_SUCCESS, payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
exports.getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => chatRoomComponent_1.default.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)));
    // Next call 2 method below. -->
    // getNewerMessageFromNet();
    // checkOlderMessages();
};
exports.CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
exports.CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
exports.CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
exports.CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
exports.uploadFile = (progressEvent, file) => ({
    type: exports.CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file }
});
const uploadFileSuccess = (result) => ({ type: exports.CHATROOM_UPLOAD_FILE_SUCCESS, payload: result.result });
const uploadFileFailure = (error) => ({ type: exports.CHATROOM_UPLOAD_FILE_FAILURE, payload: error });
exports.uploadFileCanceled = () => ({ type: exports.CHATROOM_UPLOAD_FILE_CANCELLED });
exports.uploadFileEpic = action$ => (action$.ofType(exports.CHATROOM_UPLOAD_FILE)
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
    .takeUntil(action$.ofType(exports.CHATROOM_UPLOAD_FILE_CANCELLED))
    .catch(error => Rx.Observable.of(uploadFileFailure(error.xhr.response))));
