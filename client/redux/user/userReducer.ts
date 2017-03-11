import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import { FETCH_USER_SUCCESS, FETCH_USER_FAILURE, FETCH_USER_CANCELLED } from "./userRx";
import { LOG_OUT_SUCCESS } from "../authen/authRx";

export const UserInitState = Record({
    isFetching: false,
    state: null,
    user: null,
    teamProfile: null
});
const userInitState = new UserInitState();
export const userReducer = (state = userInitState, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0]).set("state", FETCH_USER_SUCCESS);
        case FETCH_USER_CANCELLED:
            return state;
        case FETCH_USER_FAILURE:
            return state.set("state", FETCH_USER_FAILURE);
        case LOG_OUT_SUCCESS: {
            return userInitState;
        }

        default:
            return state;
    }
};