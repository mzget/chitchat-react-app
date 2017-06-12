/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
var chatroomActions_1 = require("./chatroomActions");
var chatroomRxActions = require("./chatroomRxEpic");
var chatroomActions = require("./chatroomActions");
var immutable = require("immutable");
/**
 * ## Initial State
 */
exports.ChatRoomInitState = immutable.Record({
    isFetching: false,
    state: null,
    room: null,
    responseMessage: null,
    responseFile: null,
    messages: null,
    earlyMessageReady: false,
    uploadingFile: null,
    fileInfo: null,
    error: null,
    chatDisabled: false,
    chatrooms: null
});
var initialState = new exports.ChatRoomInitState();
exports.chatroomReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case chatroomActions.JOIN_ROOM_FAILURE: {
            return state.set("state", chatroomActions.JOIN_ROOM_FAILURE)
                .set("chatDisabled", true);
        }
        case chatroomActions.JOIN_ROOM_SUCCESS: {
            return state.set("state", chatroomActions.JOIN_ROOM_SUCCESS)
                .set("chatDisabled", false);
        }
        case chatroomActions.DISABLE_CHATROOM: {
            return state.set("state", chatroomActions.DISABLE_CHATROOM)
                .set("chatDisabled", true);
        }
        case chatroomActions.ENABLE_CHATROOM: {
            return state.set("state", chatroomActions.ENABLE_CHATROOM)
                .set("chatDisabled", false);
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE)
                .set("uploadingFile", action.payload.data.target.result)
                .set("fileInfo", action.payload.file); // action.payload.form['file']
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS)
                .set("responseFile", action.payload);
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            var payload = action.payload;
            var nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            var payload = action.payload;
            var nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("error", payload);
            return nextState;
        }
        case chatroomActions_1.ON_MESSAGE_CHANGED: {
            var payload = action.payload;
            return state.set("messages", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            var payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS: {
            var payload = action.payload;
            return state.set("messages", payload);
        }
        case chatroomActions_1.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.GET_NEWER_MESSAGE_SUCCESS);
        }
        /**Create chat room */
        case chatroomRxActions.CREATE_PRIVATE_CHATROOM:
            return state.set("isFetching", true)
                .set("state", chatroomRxActions.CREATE_PRIVATE_CHATROOM);
        case chatroomRxActions.CREATE_PRIVATE_CHATROOM_SUCCESS: {
            return state.set("room", action.payload.result[0])
                .set("isFetching", false)
                .set("state", chatroomRxActions.CREATE_PRIVATE_CHATROOM_SUCCESS);
        }
        case chatroomRxActions.CREATE_PRIVATE_CHATROOM_FAILURE:
            return state.set("isFetching", false);
        /**Fetch chat room */
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM:
            return state.set("isFetching", true);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload)
                .set("isFetching", false)
                .set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state.set("isFetching", false);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE:
            return state.set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE)
                .set("isFetching", false)
                .set("room", null);
        /** Set room */
        case chatroomActions.GET_PERSISTEND_CHATROOM:
            return state.set("isFetching", false);
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            return state
                .set("state", chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS)
                .set("room", action.payload);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
            return state.set("state", chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE);
        }
        /**Set room empty */
        case chatroomActions.LEAVE_ROOM: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM)
                .set("room", null);
        }
        case chatroomActions.UPDATED_CHATROOMS: {
            return state.set("chatrooms", action.payload);
        }
        case chatroomActions.CHATROOM_REDUCER_EMPTY_STATE: {
            return state.set("state", null);
        }
        default:
            return state;
    }
};
