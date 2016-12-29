/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const StalkBridgeActions = require("../stalkBridge/stalkBridgeActions");
const immutable_1 = require("immutable");
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
exports.StalkInitState = immutable_1.Record({
    isInit: false,
    chatslogComponent: null,
    isFetching: false,
    state: null
});
const initialState = new exports.StalkInitState();
function stalkReducer(state = initialState, action) {
    if (!(state instanceof exports.StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_INIT_CHATSLOG: {
            return state.set("isInit", true)
                .set("chatslogComponent", action.payload);
        }
        case StalkBridgeActions.STALK_INIT_FAILURE: {
            return state.set("state", StalkBridgeActions.STALK_INIT_FAILURE);
        }
        default:
            return state;
    }
}
exports.stalkReducer = stalkReducer;
