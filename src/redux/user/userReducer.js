"use strict";
exports.__esModule = true;
var immutable_1 = require("immutable");
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var userRx_1 = require("./userRx");
var authRx_1 = require("../authen/authRx");
exports.UserInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    user: null,
    teamProfile: null,
    userAvatarResult: null,
    searchUsers: null
});
var userInitState = new exports.UserInitState();
exports.userReducer = function (state, action) {
    if (state === void 0) { state = userInitState; }
    switch (action.type) {
        case userRx_1.FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0])
                .set("state", userRx_1.FETCH_USER_SUCCESS);
        case userRx_1.SUGGEST_USER_SUCCESS:
            return state.set("searchUsers", action.payload);
        case authRx_1.LOG_OUT_SUCCESS: {
            return userInitState;
        }
        case userRx_1.GET_TEAM_PROFILE_FAILURE: {
            return state;
        }
        case userRx_1.GET_TEAM_PROFILE_SUCCESS: {
            var profiles = action.payload;
            if (Array.isArray(profiles) && profiles.length > 0) {
                return state.set("teamProfile", profiles[0]);
            }
            else {
                return state;
            }
        }
        case userRx_1.UPLOAD_USER_AVATAR_SUCCESS: {
            return state.set("state", userRx_1.UPLOAD_USER_AVATAR_SUCCESS)
                .set("userAvatarResult", action.payload.result);
        }
        case userRx_1.UPDATE_USER_INFO_SUCCESS: {
            return state.set("state", userRx_1.UPDATE_USER_INFO_SUCCESS);
        }
        case userRx_1.USERRX_EMPTY_STATE: {
            return state.set("userAvatarResult", null)
                .set("state", null);
        }
        default:
            return state;
    }
};
