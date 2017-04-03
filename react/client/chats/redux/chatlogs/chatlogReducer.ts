/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as ChatlogsActions from "../chatlogs/chatlogsActions";

import { Record } from "immutable";

/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
export const ChatLogInitState = Record({
    isFetching: false,
    state: null,
    chatsLog: null
});
const initialState = new ChatLogInitState();

export function chatlogReducer(state = initialState, action) {
    if (!(state instanceof ChatLogInitState)) return initialState.mergeDeep(state);

    switch (action.type) {
        case ChatlogsActions.STALK_INIT_CHATSLOG: {
            return state.set("state", ChatlogsActions.STALK_INIT_CHATSLOG);
        }
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            return state.set("chatsLog", action.payload).set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE: {
            let nextState = state.set("state", ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);

            return nextState;
        }
        case ChatlogsActions.STALK_UNREAD_MAP_CHANGED: {
            return state.set("state", ChatlogsActions.STALK_UNREAD_MAP_CHANGED);
        }
        case ChatlogsActions.STALK_CHATLOG_MAP_CHANGED: {
            let nextState = state.set("chatsLog", action.payload)
                .set("state", ChatlogsActions.STALK_CHATLOG_MAP_CHANGED);
            return nextState;
        }

        case ChatlogsActions.GET_LAST_ACCESS_ROOM_SUCCESS: {
            return state.set("state", ChatlogsActions.GET_LAST_ACCESS_ROOM_SUCCESS);
        }

        default:
            return state;
    }
}