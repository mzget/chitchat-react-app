"use strict";
exports.__esModule = true;
var immutable_1 = require("immutable");
var userRx_1 = require("../user/userRx");
var authRx = require("../authen/authRx");
var chatlogRxActions_1 = require("../../chitchat/chats/redux/chatlogs/chatlogRxActions");
var editGroupActions = require("../group/editGroupRxActions");
exports.CLEAR_ALERT = "CLEAR_ALERT";
exports.AlertInitState = immutable_1.Record({
    error: null
});
exports.alertReducer = function (state, action) {
    if (state === void 0) { state = new exports.AlertInitState(); }
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
        case editGroupActions.REMOVE_GROUP_MEMBER_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case exports.CLEAR_ALERT:
            return state.set("error", null);
        default:
            return state;
    }
};
