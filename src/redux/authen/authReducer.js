"use strict";
exports.__esModule = true;
var immutable_1 = require("immutable");
var authRx = require("./authRx");
var AppActions = require("../app/persistentDataActions");
exports.AuthenInitState = immutable_1.Record({
    token: null,
    isFetching: false,
    state: null,
    user: null
});
exports.authReducer = function (state, action) {
    if (state === void 0) { state = new exports.AuthenInitState(); }
    switch (action.type) {
        case authRx.SIGN_UP_SUCCESS:
            return state.set("state", authRx.SIGN_UP_SUCCESS);
        case authRx.AUTH_USER: {
            return state.set("user", action.payload.email);
        }
        case authRx.AUTH_USER_SUCCESS: {
            return state.set("state", authRx.AUTH_USER_SUCCESS)
                .set("token", action.payload);
        }
        case authRx.AUTH_USER_FAILURE: {
            return state.set("state", authRx.AUTH_USER_FAILURE)
                .set("token", null)
                .set("user", null);
        }
        case AppActions.GET_SESSION_TOKEN_SUCCESS: {
            return state.set("token", action.payload)
                .set("state", AppActions.GET_SESSION_TOKEN_SUCCESS);
        }
        case authRx.TOKEN_AUTH_USER_SUCCESS: {
            return state.set("state", authRx.TOKEN_AUTH_USER_SUCCESS)
                .set("user", action.payload.email);
        }
        case authRx.TOKEN_AUTH_USER_FAILURE: {
            return state.set("token", null)
                .set("state", authRx.TOKEN_AUTH_USER_FAILURE);
        }
        case authRx.LOG_OUT_SUCCESS: {
            return state.set("state", authRx.LOG_OUT_SUCCESS)
                .set("token", null)
                .set("user", null);
        }
        default:
            return state;
    }
};
