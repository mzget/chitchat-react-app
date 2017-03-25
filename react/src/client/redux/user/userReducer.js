"use strict";
const immutable_1 = require("immutable");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const userRx_1 = require("./userRx");
const authRx_1 = require("../authen/authRx");
exports.UserInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    user: null,
    teamProfile: null,
    userAvatarResult: null,
    error: null
});
const userInitState = new exports.UserInitState();
exports.userReducer = (state = userInitState, action) => {
    switch (action.type) {
        case userRx_1.FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0])
                .set("state", userRx_1.FETCH_USER_SUCCESS);
        case userRx_1.FETCH_USER_FAILURE:
            return state.set("state", userRx_1.FETCH_USER_FAILURE);
        case authRx_1.LOG_OUT_SUCCESS: {
            return userInitState;
        }
        case userRx_1.GET_TEAM_PROFILE_FAILURE: {
            return state;
        }
        case userRx_1.GET_TEAM_PROFILE_SUCCESS: {
            let profiles = action.payload;
            if (Array.isArray(profiles) && profiles.length > 0) {
                return state.set("teamProfile", profiles[0]);
            }
            else {
                return state;
            }
        }
        case userRx_1.UPLOAD_USER_AVATAR_FAILURE: {
            return state.set("state", userRx_1.UPLOAD_USER_AVATAR_FAILURE)
                .set("error", action.payload.message.toString());
        }
        case userRx_1.UPLOAD_USER_AVATAR_SUCCESS: {
            return state.set("state", userRx_1.UPLOAD_USER_AVATAR_SUCCESS)
                .set("userAvatarResult", action.payload.result);
        }
        case userRx_1.UPDATE_USER_INFO_SUCCESS: {
            return state.set("state", userRx_1.UPDATE_USER_INFO_SUCCESS);
        }
        case userRx_1.UPDATE_USER_INFO_FAILURE: {
            return state.set("state", userRx_1.UPDATE_USER_INFO_FAILURE)
                .set("error", action.payload.message);
        }
        case userRx_1.USERRX_EMPTY_STATE: {
            return state.set("error", null)
                .set("userAvatarResult", null)
                .set("state", null);
        }
        default:
            return state;
    }
};
