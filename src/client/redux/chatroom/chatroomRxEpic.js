"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
const chatRoomComponent_1 = require("../../chats/chatRoomComponent");
const config_1 = require("../../configs/config");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
exports.FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
exports.FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
exports.FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
exports.FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
exports.fetchPrivateChatRoom = (ownerId, roommateId) => ({ type: exports.FETCH_PRIVATE_CHATROOM, payload: { ownerId, roommateId } });
const fetchPrivateChatRoomSuccess = (payload) => ({ type: exports.FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: exports.FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: exports.FETCH_PRIVATE_CHATROOM_FAILURE, payload, error: true });
exports.getPrivateChatRoomEpic = action$ => {
    return action$.ofType(exports.FETCH_PRIVATE_CHATROOM)
        .mergeMap(action => ajax.post(`${config_1.default.api.chatroom}`, action.payload))
        .map(json => fetchPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(exports.FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.xhr.response)));
};
const CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
exports.CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
const CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
const CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
exports.createPrivateChatRoom = (owner, roommate) => ({
    type: CREATE_PRIVATE_CHATROOM, payload: { owner, roommate }
});
const createPrivateChatRoomSuccess = (payload) => ({
    type: exports.CREATE_PRIVATE_CHATROOM_SUCCESS, payload
});
const createPrivateRoomCancelled = () => ({
    type: CREATE_PRIVATE_CHATROOM_CANCELLED
});
const createPrivateChatRoomFailure = (payload) => ({
    type: CREATE_PRIVATE_CHATROOM_FAILURE, payload
});
exports.createPrivateChatRoomEpic = action$ => {
    return action$.ofType(CREATE_PRIVATE_CHATROOM)
        .mergeMap(action => ajax({
        method: 'POST',
        url: `${config_1.default.api.chatroom}/createPrivateRoom`,
        body: action.payload,
        headers: { 'Content-Type': 'application/json' }
    }))
        .map(json => createPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)));
};
const GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
const GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
const GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
const GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
const getPersistendMessage_cancel = () => ({ type: GET_PERSISTEND_MESSAGE_CANCELLED });
const getPersistendMessage_success = (payload) => ({ type: GET_PERSISTEND_MESSAGE_SUCCESS, payload: payload });
const getPersistendMessage_failure = (error) => ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error });
exports.getPersistendMessage = (currentRid) => ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid });
exports.getPersistendMessageEpic = action$ => {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(action => chatRoomComponent_1.default.getInstance().getPersistentMessage(action.payload))
        .map(json => getPersistendMessage_success(json))
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))
        .catch(error => Rx.Observable.of(getPersistendMessage_failure(error)));
    //@ Next call 2 method below. -->
    //getNewerMessageFromNet();
    //checkOlderMessages();
};
const UPLOAD_FILE = "UPLOAD_FILE";
const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
const UPLOAD_FILE_FAILURE = "UPLOAD_FILE_FAILURE";
const UPLOAD_FILE_CANCELLED = "UPLOAD_FILE_CANCELLED";
exports.uploadFile = (formData) => ({ type: UPLOAD_FILE, payload: formData });
const uploadFileSuccess = (payload) => ({ type: UPLOAD_FILE_SUCCESS, payload });
const uploadFileFailure = (error) => ({ type: UPLOAD_FILE_FAILURE, payload: error });
const uploadFileCanceled = () => ({ type: UPLOAD_FILE_CANCELLED });
exports.uploadFileEpic = action$ => (action$.ofType(UPLOAD_FILE)
    .mergeMap(action => {
    return ajax({
        method: 'POST',
        url: `${config_1.default.api.fileUpload}`,
        body: action.payload,
        headers: {}
    });
})
    .map(json => uploadFileSuccess(json.response))
    .takeUntil(action$.ofType(UPLOAD_FILE_CANCELLED))
    .catch(error => Rx.Observable.of(uploadFileFailure(error))));
