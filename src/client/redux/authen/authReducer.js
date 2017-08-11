import { Record } from "immutable";
import * as authRx from "./authRx";
import * as AppActions from "../app/persistentDataActions";
export const AuthenInitState = Record({
    token: null,
    isFetching: false,
    state: null,
    user: null
});
export const authReducer = (state = new AuthenInitState(), action) => {
    switch (action.type) {
        case authRx.SIGN_UP_SUCCESS:
            return state.set("state", authRx.SIGN_UP_SUCCESS);
        case authRx.AUTH_USER: {
            return state.set("user", action.payload.email).set("isFetching", true);
        }
        case authRx.AUTH_USER_SUCCESS: {
            return state.set("token", action.payload).set("isFetching", false);
            ;
        }
        case authRx.AUTH_USER_FAILURE: {
            return state.set("state", authRx.AUTH_USER_FAILURE)
                .set("token", null)
                .set("user", null).set("isFetching", false);
            ;
        }
        case authRx.AUTH_SOCIAL: {
            return state.set("user", action.payload.email).set("isFetching", true);
        }
        case authRx.AUTH_SOCIAL_FAILURE: {
            return state.set("state", authRx.AUTH_SOCIAL_FAILURE)
                .set("token", null)
                .set("user", null).set("isFetching", false);
        }
        case authRx.AUTH_SOCIAL_SUCCESS: {
            return state.set("token", action.payload).set("isFetching", false);
        }
        case AppActions.GET_SESSION_TOKEN_SUCCESS: {
            return state.set("token", action.payload)
                .set("state", AppActions.GET_SESSION_TOKEN_SUCCESS);
        }
        case authRx.TOKEN_AUTH_USER: return state.set("isFetching", true);
        case authRx.TOKEN_AUTH_USER_SUCCESS: {
            return state.set("user", action.payload.email).set("isFetching", false);
        }
        case authRx.TOKEN_AUTH_USER_FAILURE: {
            return state.set("token", null).set("isFetching", false);
        }
        case authRx.AUTH_FETCHING: {
            return state.set("isFetching", true);
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
