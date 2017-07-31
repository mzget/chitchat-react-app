import { ChatRoomActionsType, GET_NEWER_MESSAGE_SUCCESS, ON_MESSAGE_CHANGED, SEND_MESSAGE_FAILURE, GET_CHAT_TARGET_UID_SUCCESS, GET_CHAT_TARGET_UID_FAILURE } from "./";
import * as chatroomRxActions from "./chatroomRxEpic";
import * as chatroomActions from "./chatroomActions";
import * as immutable from "immutable";
const chatroomDefaults = {
    isFetching: false,
    state: null,
    room: null,
    chatTargets: null,
    responseFile: null,
    messages: null,
    earlyMessageReady: false,
    uploadingFile: null,
    fileInfo: null,
    error: null,
    chatDisabled: false,
    chatrooms: null
};
export class ChatRoomRecoder extends immutable.Record(chatroomDefaults) {
    constructor(params) {
        super(params);
    }
    get(value) {
        return super.get(value);
    }
}
export const chatRoomRecoder = new ChatRoomRecoder(chatroomDefaults);
export const chatroomReducer = (state = chatRoomRecoder, action) => {
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
                .set("fileInfo", action.payload.file);
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS)
                .set("responseFile", action.payload);
        }
        case SEND_MESSAGE_FAILURE: {
            let payload = action.payload;
            let nextState = state.set("state", SEND_MESSAGE_FAILURE)
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
        case chatroomActions.LEAVE_ROOM: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM)
                .set("room", null)
                .set("chatTargets", []);
        }
        case chatroomActions.UPDATED_CHATROOMS: {
            return state.set("chatrooms", action.payload);
        }
        case GET_CHAT_TARGET_UID_SUCCESS: {
            return state.set("chatTargets", action.payload);
        }
        case GET_CHAT_TARGET_UID_FAILURE: {
            return state.set("chatTargets", []);
        }
        default:
            return state;
    }
};
