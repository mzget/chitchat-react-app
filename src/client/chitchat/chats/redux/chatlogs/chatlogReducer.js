import * as ChatlogsActions from "../chatlogs/chatlogsActions";
import * as ChatlogRxActions from "../chatlogs/chatlogRxActions";
import { Record } from "immutable";
export const chatlogDefaults = {
    isFetching: false,
    state: null,
    chatsLog: null,
    logCount: null,
    roomAccess: null,
    error: null
};
export class ChatLogRecord extends Record(chatlogDefaults) {
    constructor(params) {
        super(params);
    }
    get(value) {
        return super.get(value);
    }
}
const initialState = new ChatLogRecord(chatlogDefaults);
export function chatlogReducer(state = initialState, action) {
    switch (action.type) {
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            let { chatsLog, logCount } = action.payload;
            return state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE: {
            let nextState = state.set("state", ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);
            return nextState;
        }
        case ChatlogsActions.STALK_CHATLOG_MAP_CHANGED: {
            let { chatsLog, logCount } = action.payload;
            let nextState = state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_CHATLOG_MAP_CHANGED);
            return nextState;
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM: {
            return state.set("isFetching", true);
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_SUCCESS: {
            let data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess).set("isFetching", false);
            }
            else {
                return state.set("isFetching", false);
            }
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("roomAccess", null)
                .set("isFetching", false);
        }
        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_SUCCESS: {
            return state.set("roomAccess", action.payload)
                .set("isFetching", false);
        }
        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("isFetching", false);
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS: {
            return state.set("isFetching", true)
                .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS);
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS: {
            let data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess)
                    .set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            }
            else {
                return state.set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            }
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_FAILURE: {
            return state.set("isFetching", false);
        }
        default:
            return state;
    }
}
