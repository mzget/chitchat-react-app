"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var Rx = require("rxjs/Rx");
var _a = Rx.Observable, ajax = _a.ajax, fromPromise = _a.fromPromise;
var ChatRoomComponent_1 = require("../../ChatRoomComponent");
var ChitchatFactory_1 = require("../../ChitchatFactory");
var chatroomService = require("../../services/chatroomService");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var getStore = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().store; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
exports.FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
exports.FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
exports.FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
exports.FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
exports.fetchPrivateChatRoom = function (ownerId, roommateId) { return ({ type: exports.FETCH_PRIVATE_CHATROOM, payload: { ownerId: ownerId, roommateId: roommateId } }); };
var fetchPrivateChatRoomSuccess = function (payload) { return ({ type: exports.FETCH_PRIVATE_CHATROOM_SUCCESS, payload: payload }); };
var cancelFetchPrivateChatRoom = function () { return ({ type: exports.FETCH_PRIVATE_CHATROOM_CANCELLED }); };
var fetchPrivateChatRoomFailure = function (payload) { return ({ type: exports.FETCH_PRIVATE_CHATROOM_FAILURE, payload: payload }); };
exports.getPrivateChatRoom_Epic = function (action$) {
    return action$.ofType(exports.FETCH_PRIVATE_CHATROOM)
        .mergeMap(function (action) { return fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId)); })
        .mergeMap(function (response) { return fromPromise(response.json()); })
        .map(function (json) {
        if (json.success) {
            return fetchPrivateChatRoomSuccess(json.result[0]);
        }
        else {
            return fetchPrivateChatRoomFailure(json.message);
        }
    })._do(function (x) {
        if (x.type == exports.FETCH_PRIVATE_CHATROOM_FAILURE) {
            console.warn("Need to create private chat room!");
        }
    })
        .takeUntil(action$.ofType(exports.FETCH_PRIVATE_CHATROOM_CANCELLED))["catch"](function (error) { return Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)); });
};
exports.CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
exports.CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
exports.CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
exports.CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
exports.createPrivateChatRoom = function (owner, roommate) { return ({ type: exports.CREATE_PRIVATE_CHATROOM, payload: { owner: owner, roommate: roommate } }); };
var createPrivateChatRoomSuccess = function (payload) { return ({ type: exports.CREATE_PRIVATE_CHATROOM_SUCCESS, payload: payload }); };
var createPrivateRoomCancelled = function () { return ({ type: exports.CREATE_PRIVATE_CHATROOM_CANCELLED }); };
var createPrivateChatRoomFailure = function (payload) { return ({ type: exports.CREATE_PRIVATE_CHATROOM_FAILURE, payload: payload }); };
exports.createPrivateChatRoomEpic = function (action$) {
    return action$.ofType(exports.CREATE_PRIVATE_CHATROOM)
        .mergeMap(function (action) { return ajax({
        method: "POST",
        url: getConfig().api.group + "/private_chat/create",
        body: action.payload,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": authReducer().chitchat_token
        }
    }); })
        .map(function (json) { return createPrivateChatRoomSuccess(json.response); })
        .takeUntil(action$.ofType(exports.CREATE_PRIVATE_CHATROOM_CANCELLED))["catch"](function (error) { return Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)); });
};
var GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
var GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
exports.GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
var GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
exports.getPersistendMessage = function (currentRid) { return ({ type: GET_PERSISTEND_MESSAGE, payload: currentRid }); };
var getPersistendMessage_cancel = function () { return ({ type: GET_PERSISTEND_MESSAGE_CANCELLED }); };
var getPersistendMessage_success = function (payload) { return ({ type: exports.GET_PERSISTEND_MESSAGE_SUCCESS, payload: payload }); };
var getPersistendMessage_failure = function (error) { return ({ type: GET_PERSISTEND_MESSAGE_FAILURE, payload: error }); };
exports.getPersistendMessageEpic = function (action$) {
    return action$.ofType(GET_PERSISTEND_MESSAGE)
        .mergeMap(function (action) { return ChatRoomComponent_1.ChatRoomComponent.getInstance().getPersistentMessage(action.payload); })
        .map(function (json) { return getPersistendMessage_success(json); })
        .takeUntil(action$.ofType(GET_PERSISTEND_MESSAGE_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getPersistendMessage_failure(error)); });
    // Next call 2 method below. -->
    // getNewerMessageFromNet();
    // checkOlderMessages();
};
exports.CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
exports.CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
exports.CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
exports.CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
exports.uploadFile = function (progressEvent, file) { return ({
    type: exports.CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file }
}); };
var uploadFileSuccess = function (result) { return ({ type: exports.CHATROOM_UPLOAD_FILE_SUCCESS, payload: result.result }); };
var uploadFileFailure = function (error) { return ({ type: exports.CHATROOM_UPLOAD_FILE_FAILURE, payload: error }); };
exports.uploadFileCanceled = function () { return ({ type: exports.CHATROOM_UPLOAD_FILE_CANCELLED }); };
exports.uploadFileEpic = function (action$) { return (action$.ofType(exports.CHATROOM_UPLOAD_FILE)
    .mergeMap(function (action) {
    var body = new FormData();
    body.append("file", action.payload.file);
    return ajax({
        method: "POST",
        url: "" + getConfig().api.fileUpload,
        body: body,
        headers: {}
    });
})
    .map(function (json) { return uploadFileSuccess(json.response); })
    .takeUntil(action$.ofType(exports.CHATROOM_UPLOAD_FILE_CANCELLED))["catch"](function (error) { return Rx.Observable.of(uploadFileFailure(error.xhr.response)); })); };
