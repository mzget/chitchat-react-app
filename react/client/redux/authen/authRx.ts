import config from "../../configs/config";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import * as AppActions from "../app/persistentDataActions";
import * as stalkBridgeActions from "../../chats/redux/stalkBridge/stalkBridgeActions";

const SIGN_UP = "SIGN_UP";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
const SIGN_UP_CANCELLED = "SIGN_UP_CANCELLED";

export const signup = (user) => ({ type: SIGN_UP, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const signupSuccess = payload => ({ type: SIGN_UP_SUCCESS, payload });
const signupFailure = payload => ({ type: SIGN_UP_FAILURE, payload, error: true });
const signupCancelled = () => ({ type: SIGN_UP_CANCELLED });
export const signupUserEpic = action$ => (
    action$.ofType(SIGN_UP)
        .mergeMap(action => ajax({
            method: "POST",
            url: `${config.api.user}/signup`,
            body: JSON.stringify({ user: action.payload }),
            headers: { "Content-Type": "application/json", "x-api-key": config.api.apiKey }
        }).map(response => signupSuccess(response.xhr.response))
            .takeUntil(action$.ofType(SIGN_UP_CANCELLED))
            .catch(error => Rx.Observable.of(signupFailure(error.xhr.response)))
        )
);


export const AUTH_USER = "AUTH_USER";
export const AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
export const AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
const AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
export const authUser = (user: { email: string, password: string }) => ({ type: AUTH_USER, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const authUserSuccess = payload => ({ type: AUTH_USER_SUCCESS, payload });
const authUserFailure = payload => ({ type: AUTH_USER_FAILURE, payload });
const authUserCancelled = () => ({ type: AUTH_USER_CANCELLED });
export const authUserEpic = action$ =>
    action$.ofType(AUTH_USER).mergeMap(action => ajax({
        method: "POST",
        url: `${config.api.auth}`,
        body: JSON.stringify(action.payload),
        headers: { "Content-Type": "application/json", "x-api-key": config.api.apiKey }
    })
        .map(response => authUserSuccess(response.xhr.response))
        .takeUntil(action$.ofType(AUTH_USER_CANCELLED))
        .catch(error => Rx.Observable.of(authUserFailure((error.xhr.response) ? error.xhr.response.message : error.message)))
    );


const TOKEN_AUTH_USER = "TOKEN_AUTH_USER";
export const TOKEN_AUTH_USER_SUCCESS = "TOKEN_AUTH_USER_SUCCESS";
export const TOKEN_AUTH_USER_FAILURE = "TOKEN_AUTH_USER_FAILURE";
const TOKEN_AUTH_USER_CANCELLED = "TOKEN_AUTH_USER_CANCELLED";
export const tokenAuthUser = (token) => ({ type: TOKEN_AUTH_USER, payload: token }); // username => ({ type: FETCH_USER, payload: username });
const tokenAuthUserSuccess = payload => ({ type: TOKEN_AUTH_USER_SUCCESS, payload });
const tokenAuthUserFailure = payload => ({ type: TOKEN_AUTH_USER_FAILURE, payload });
const tokenAuthUserCancelled = () => ({ type: TOKEN_AUTH_USER_CANCELLED });
export const tokenAuthUserEpic = action$ => (
    action$.ofType(TOKEN_AUTH_USER)
        .mergeMap(action => ajax({
            method: "POST",
            url: `${config.api.auth}/verify`,
            body: JSON.stringify({ token: action.payload }),
            headers: { "Content-Type": "application/json" }
        })
            .map(response => tokenAuthUserSuccess(response.xhr.response))
            .takeUntil(action$.ofType(TOKEN_AUTH_USER_CANCELLED))
            .catch(error => Rx.Observable.of(tokenAuthUserFailure((error.xhr.response) ? error.xhr.response.message : error.message)))
        )
);

const LOG_OUT = "LOG_OUT";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";
const LOG_OUT_CANCELLED = "LOG_OUT_CANCELLED";
export const logout = createAction(LOG_OUT, payload => payload);
const logoutSuccess = createAction(LOG_OUT_SUCCESS, payload => payload);
const logoutFailure = createAction(LOG_OUT_FAILURE, payload => payload);
const logoutCancelled = createAction(LOG_OUT_CANCELLED);
export const logoutUserEpic = action$ => action$.ofType(LOG_OUT)
    .mergeMap(action => ajax({
        method: "POST",
        url: `${config.api.auth}/logout`,
        headers: { "Content-Type": "application/json", "x-access-token": action.payload }
    }).map(response => {
        AppActions.removeSession();
        stalkBridgeActions.stalkLogout();
        return logoutSuccess(response.xhr.response);
    })
        .takeUntil(action$.ofType(LOG_OUT_CANCELLED))
        .catch(error => Rx.Observable.of(logoutFailure(error.xhr.response)))
    );


export const AUTH_REDUCER_CLEAR_ERROR = "AUTH_REDUCER_CLEAR_ERROR";
export const clearError = createAction(AUTH_REDUCER_CLEAR_ERROR);
