import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import {
    FETCH_USER_SUCCESS, FETCH_USER_FAILURE,
    GET_TEAM_PROFILE_SUCCESS, GET_TEAM_PROFILE_FAILURE,
    UPLOAD_USER_AVATAR_FAILURE, UPLOAD_USER_AVATAR_SUCCESS,
    USERRX_EMPTY_STATE,
    UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE
} from "./userRx";
import { LOG_OUT_SUCCESS } from "../authen/authRx";

export const UserInitState = Record({
    isFetching: false,
    state: null,
    user: null,
    teamProfile: null,
    userAvatarResult: null,
    error: null
});
const userInitState = new UserInitState();
export const userReducer = (state = userInitState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0])
                .set("state", FETCH_USER_SUCCESS);
        case FETCH_USER_FAILURE: {
            return state.set("state", FETCH_USER_FAILURE)
                .set("error", action.payload.message);
        }
        case LOG_OUT_SUCCESS: {
            return userInitState;
        }

        case GET_TEAM_PROFILE_FAILURE: {
            return state;
        }
        case GET_TEAM_PROFILE_SUCCESS: {
            let profiles = action.payload;
            if (Array.isArray(profiles) && profiles.length > 0) {
                return state.set("teamProfile", profiles[0]);
            }
            else {
                return state;
            }
        }

        case UPLOAD_USER_AVATAR_FAILURE: {
            return state.set("state", UPLOAD_USER_AVATAR_FAILURE)
                .set("error", action.payload.message.toString());
        }
        case UPLOAD_USER_AVATAR_SUCCESS: {
            return state.set("state", UPLOAD_USER_AVATAR_SUCCESS)
                .set("userAvatarResult", action.payload.result);
        }
        case UPDATE_USER_INFO_SUCCESS: {
            return state.set("state", UPDATE_USER_INFO_SUCCESS);
        }
        case UPDATE_USER_INFO_FAILURE: {
            return state.set("state", UPDATE_USER_INFO_FAILURE)
                .set("error", action.payload.message);
        }

        case USERRX_EMPTY_STATE: {
            return state.set("error", null)
                .set("userAvatarResult", null)
                .set("state", null);
        }

        default:
            return state;
    }
};