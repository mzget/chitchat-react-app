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
    chatsLog: null,
    isFetching: false,
    state: null
});
const initialState = new exports.ChatLogInitState();
function chatlogReducer(state = initialState, action) {
    if (!(state instanceof exports.ChatLogInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            return state.set("chatsLog", action.payload).set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATSLOG_CONTACT_COMPLETE: {
            let nextState = state.set("state", ChatlogsActions.STALK_CHATSLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);
            return nextState;
        }
        case ChatlogsActions.STALK_UNREAD_MAP_CHANGED: {
            let nextState = state.set("chatsLog", action.payload)
                .set("state", ChatlogsActions.STALK_UNREAD_MAP_CHANGED);
            return nextState;
        }
        default:
            return state;
    }
}
exports.chatlogReducer = chatlogReducer;
