"use strict";
const immutable_1 = require("immutable");
const userRx_1 = require("../user/userRx");
const authRx = require("../authen/authRx");
const chatlogRxActions_1 = require("../../chitchat/chats/redux/chatlogs/chatlogRxActions");
exports.CLEAR_ALERT = "CLEAR_ALERT";
exports.AlertInitState = immutable_1.Record({
    error: null
});
exports.alertReducer = (state = new exports.AlertInitState(), action) => {
    switch (action.type) {
        /**
         * User reducer.
         */
        case userRx_1.UPLOAD_USER_AVATAR_FAILURE: {
            return state.set("error", action.payload.message.toString());
        }
        case userRx_1.FETCH_USER_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case userRx_1.UPDATE_USER_INFO_FAILURE: {
            return state.set("error", action.payload.message);
        }
        /**
         * Auth reducer.
         */
        case authRx.SIGN_UP_FAILURE:
            return state.set("error", action.payload);
        case authRx.AUTH_USER_FAILURE: {
            return state.set("error", JSON.stringify(action.payload));
        }
        case authRx.TOKEN_AUTH_USER_FAILURE: {
            return state;
        }
        case authRx.AUTH_REDUCER_CLEAR_ERROR: {
            return state.set("error", null);
        }
        /**
         * Chatlog reducer...
         */
        case chatlogRxActions_1.UPDATE_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case exports.CLEAR_ALERT:
            return state.set("error", null);
        default:
            return state;
    }
};
