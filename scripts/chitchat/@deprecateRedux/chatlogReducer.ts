/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as ChatlogsActions from "../chatlogs/chatlogsActions";
import * as ChatlogRxActions from "../chatlogs/chatlogRxActions";

import { Record } from "immutable";

// Define our record defaults
export const chatlogDefaults = {
    isFetching: false,
    state: null,
    chatsLog: null,
    logCount: null,
    roomAccess: null,
    error: null,
};
// Define our record types with a typescript interface
interface IChatLogParams {
    isFetching: boolean;
    state: string;
    chatsLog: any;
    logCount: number;
    roomAccess: any;
    error: string;
}
// Create our FruitRecord class
export class ChatLogRecord extends Record(chatlogDefaults) {

    // Set the params. This will also typecheck when we instantiate a new FruitRecord
    constructor(params: IChatLogParams) {
        super(params);
    }

    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get<T extends keyof IChatLogParams>(value: T): IChatLogParams[T] {
        // super.get() is mapped to the original get() function on Record
        return super.get(value);
    }
}
const initialState = new ChatLogRecord(chatlogDefaults);

export function chatlogReducer(state = initialState, action) {
    switch (action.type) {
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            const { chatsLog, logCount } = action.payload;
            return state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE: {
            const nextState = state.set("state", ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);

            return nextState;
        }
        case ChatlogsActions.STALK_CHATLOG_MAP_CHANGED: {
            const { chatsLog, logCount } = action.payload;
            const nextState = state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_CHATLOG_MAP_CHANGED);
            return nextState;
        }

        case ChatlogRxActions.GET_LAST_ACCESS_ROOM: {
            return state.set("isFetching", true);
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_SUCCESS: {
            const data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess).set("isFetching", false);
            } else {
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
            const data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess)
                    .set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            } else {
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
