/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const ChatlogRxActions = require("../chatlogs/chatlogRxActions");
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
    roomAccess: null,
    error: null
});
const initialState = new exports.ChatLogInitState();
function chatlogReducer(state = initialState, action) {
    if (!(state instanceof exports.ChatLogInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            return state.set("chatsLog", action.payload).set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE: {
            let nextState = state.set("state", ChatlogsActions.STALK_CHATLOG_CONTACT_COMPLETE)
                .set("chatsLog", action.payload);
            return nextState;
        }
        case ChatlogsActions.STALK_CHATLOG_MAP_CHANGED: {
            let nextState = state.set("chatsLog", action.payload)
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
            return state.set("roomAccess", null).set("isFetching", false);
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
exports.chatlogReducer = chatlogReducer;
