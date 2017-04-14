/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import { ChatRoomActionsType, UPDATE_CHATROOMS } from "./chatroomActions";
import * as chatroomRxActions from "./chatroomRxEpic";
import * as chatroomActions from "./chatroomActions";
import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import * as chatlogsActions from "../chatlogs/chatlogsActions";

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
    newMessage: null,
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

        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload.result[0])
                .set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS);

        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state;

        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE:
            return state.set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE)
                .set("room", null);

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

        case ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }

        case ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS);
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

        case chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS);
        }

        case chatroomRxActions.CREATE_PRIVATE_CHATROOM_SUCCESS: {
            return state.set("room", action.payload.result[0])
                .set("state", chatroomRxActions.CREATE_PRIVATE_CHATROOM_SUCCESS);
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