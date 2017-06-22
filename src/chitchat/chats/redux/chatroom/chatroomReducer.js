/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { ChatRoomActionsType, GET_NEWER_MESSAGE_SUCCESS, ON_MESSAGE_CHANGED } from "./chatroomActions";
import * as chatroomRxActions from "./chatroomRxEpic";
import * as chatroomActions from "./chatroomActions";
import * as immutable from "immutable";
/**
 * ## Initial State
 */
export const ChatRoomInitState = immutable.Record({
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
const initialState = new ChatRoomInitState();
export const chatroomReducer = (state = initialState, action) => {
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
                .set("error", payload);
            return nextState;
        }
        case ON_MESSAGE_CHANGED: {
            let payload = action.payload;
            return state.set("messages", payload);
        }
        case ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload)
                .set("state", chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload);
        }
        case GET_NEWER_MESSAGE_SUCCESS: {
            let payload = action.payload;
            return state.set("messages", payload);
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
        default:
            return state;
    }
};
