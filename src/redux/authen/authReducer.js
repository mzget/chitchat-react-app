"use strict";
const immutable_1 = require("immutable");
const authRx = require("./authRx");
const AppActions = require("../app/persistentDataActions");
exports.AuthenInitState = immutable_1.Record({
    token: null,
    isFetching: false,
    error: null,
    state: null,
    user: null
});
exports.authReducer = (state = new exports.AuthenInitState(), action) => {
    switch (action.type) {
        case authRx.SIGN_UP_SUCCESS:
            return state.set("state", authRx.SIGN_UP_SUCCESS);
        case authRx.SIGN_UP_FAILURE:
            return state.set("state", authRx.SIGN_UP_FAILURE)
                .set("error", action.payload);
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
                .set("user", null)
                .set("error", JSON.stringify(action.payload));
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
                .set("error", action.payload)
                .set("state", authRx.TOKEN_AUTH_USER_FAILURE);
        }
        case authRx.LOG_OUT_SUCCESS: {
            return state.set("state", authRx.LOG_OUT_SUCCESS)
                .set("token", null)
                .set("user", null);
        }
        case authRx.AUTH_REDUCER_CLEAR_ERROR: {
            return state.set("error", null).set("state", authRx.AUTH_REDUCER_CLEAR_ERROR);
        }
        default:
            return state;
    }
};
