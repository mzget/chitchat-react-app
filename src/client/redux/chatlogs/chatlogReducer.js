/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const immutable_1 = require("immutable");
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
exports.ChatLogInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    chatsLog: null,
    chatslogComponent: null
});
const initialState = new exports.ChatLogInitState();
function chatlogReducer(state = initialState, action) {
    if (!(state instanceof exports.ChatLogInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_INIT_CHATSLOG: {
            return state.set("chatslogComponent", action.payload)
                .set("state", ChatlogsActions.STALK_INIT_CHATSLOG);
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
exports.chatlogReducer = chatlogReducer;
