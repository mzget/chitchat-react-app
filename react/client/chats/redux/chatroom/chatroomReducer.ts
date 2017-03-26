﻿/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import { ChatRoomActionsType } from "./chatroomActions";
import * as ChatRoomRx from "./chatroomRxEpic";
import * as chatroomActions from "./chatroomActions";
import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import { Record } from "immutable";

/**
 * ## Initial State
 */
export const ChatRoomInitState = Record({
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
    chatDisabled: false
});
const initialState = new ChatRoomInitState();

export const chatroomReducer = (state = new ChatRoomInitState(), action) => {
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
                .set("fileInfo", action.payload.file); // action.payload.form['file']
        }
        case ChatRoomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state.set("state", ChatRoomRx.CHATROOM_UPLOAD_FILE_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case ChatRoomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", ChatRoomRx.CHATROOM_UPLOAD_FILE_SUCCESS)
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
        case ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS);
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

        case ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }
        case ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS);
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
        case ChatRoomActionsType.SEND_MESSAGE_REQUEST: {
            let nextState = state.set("state", ChatRoomActionsType.SEND_MESSAGE_REQUEST)
                .set("isFetching", true);

            return nextState;
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
                .set("responseMessage", payload);

            return nextState;
        }

        case ChatRoomActionsType.REPLACE_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.REPLACE_MESSAGE)
                .set("newMessage", payload);
        }
        case ChatRoomActionsType.ON_NEW_MESSAGE: {
            let payload = action.payload;
            return state.set("state", ChatRoomActionsType.ON_NEW_MESSAGE)
                .set("newMessage", payload);
        }

        case ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
            return state.set("state", ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS);
        }

        default:
            return state;
    }
}