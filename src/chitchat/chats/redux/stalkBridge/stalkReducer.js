/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
var StalkBridgeActions = require("../stalkBridge/stalkBridgeActions");
var StalkNotificationActions = require("./StalkNotificationActions");
var immutable_1 = require("immutable");
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
    isFetching: false,
    state: null,
    notiMessage: "",
    stalkToken: "",
    user: null
});
var initialState = new exports.StalkInitState();
function stalkReducer(state, action) {
    if (state === void 0) { state = initialState; }
    if (!(state instanceof exports.StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case StalkBridgeActions.STALK_INIT: {
            return state.set("isInit", false)
                .set("state", StalkBridgeActions.STALK_INIT);
        }
        case StalkBridgeActions.STALK_INIT_SUCCESS: {
            return state.set("isInit", true)
                .set("stalkToken", action.payload.token)
                .set("user", action.payload.user)
                .set("state", StalkBridgeActions.STALK_INIT_SUCCESS);
        }
        case StalkBridgeActions.STALK_INIT_FAILURE: {
            return state.set("isInit", true)
                .set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_CLOSE: {
            return state.set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_DISCONNECTED: {
            return state.set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT: {
            return state.set("state", StalkBridgeActions.STALK_ON_SOCKET_RECONNECT);
        }
        case StalkNotificationActions.STALK_NOTICE_NEW_MESSAGE: {
            return state.set("notiMessage", action.payload);
        }
        default:
            return state;
    }
}
exports.stalkReducer = stalkReducer;
