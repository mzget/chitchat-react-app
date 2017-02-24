/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatroomActions_1 = require("./chatroomActions");
const ChatRoomRx = require("./chatroomRxEpic");
const chatroomActions = require("./chatroomActions");
const immutable_1 = require("immutable");
/**
 * ## Initial State
 */
exports.ChatRoomInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    room: null,
    responseMessage: null,
    responseFile: null,
    newMessage: null,
    earlyMessageReady: false,
    uploadingFile: null,
    fileInfo: null
});
const initialState = new exports.ChatRoomInitState();
exports.chatroomReducer = (state = new exports.ChatRoomInitState(), action) => {
    switch (action.type) {
        case ChatRoomRx.FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload.result[0])
                .set("state", ChatRoomRx.FETCH_PRIVATE_CHATROOM_SUCCESS);
        case ChatRoomRx.FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state;
        case ChatRoomRx.FETCH_PRIVATE_CHATROOM_FAILURE:
            return state.set("state", ChatRoomRx.FETCH_PRIVATE_CHATROOM_FAILURE)
                .set("room", null);
        case ChatRoomRx.CHATROOM_UPLOAD_FILE: {
            return state.set("state", ChatRoomRx.CHATROOM_UPLOAD_FILE)
                .set("uploadingFile", action.payload.data.target.result)
                .set("fileInfo", action.payload.file); //action.payload.form['file']
        }
        case ChatRoomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state;
        }
        case ChatRoomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", ChatRoomRx.CHATROOM_UPLOAD_FILE_SUCCESS)
                .set("responseFile", action.payload);
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            return state
                .set("state", chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS)
                .set("room", action.payload);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
            return state.set("state", chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE);
        }
        case chatroomActions.LEAVE_ROOM: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM)
                .set("room", null);
        }
        case chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case chatroomActions_1.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS);
        }
        case ChatRoomRx.CREATE_PRIVATE_CHATROOM_SUCCESS: {
            return state.set("room", action.payload.result[0])
                .set("state", ChatRoomRx.CREATE_PRIVATE_CHATROOM_SUCCESS);
        }
        case chatroomActions.CHATROOM_REDUCER_EMPTY_STATE: {
            return state.set("state", null);
        }
        default:
            return state;
    }
};
function oldRoomReducer(state = initialState, action) {
    switch (action.type) {
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_REQUEST: {
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_REQUEST)
                .set("isFetching", true);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_SUCCESS)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", chatroomActions_1.ChatRoomActionsType.SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("responseMessage", payload);
            return nextState;
        }
        case chatroomActions_1.ChatRoomActionsType.REPLACE_MESSAGE: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.REPLACE_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", chatroomActions_1.ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }
        case chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions_1.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            let roomInfo = (!!action.payload) ? action.payload : state.get("selectRoom");
            return state
                .set("state", chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS)
                .set("selectRoom", roomInfo);
        }
        default:
            return state;
    }
}
