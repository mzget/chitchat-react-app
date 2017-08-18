import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { Observable } = Rx;
const { ajax, fromPromise } = Observable;
import * as authService from "../../chitchat/chats/services/authService";
import * as AppActions from "../app/persistentDataActions";
import * as stalkBridgeActions from "../../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
const SIGN_UP = "SIGN_UP";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
const SIGN_UP_CANCELLED = "SIGN_UP_CANCELLED";
export const signup = (user) => ({ type: SIGN_UP, payload: user });
const signupSuccess = payload => ({ type: SIGN_UP_SUCCESS, payload });
const signupFailure = payload => ({ type: SIGN_UP_FAILURE, payload });
const signupCancelled = () => ({ type: SIGN_UP_CANCELLED });
export const signupUserEpic = action$ => action$.ofType(SIGN_UP)
    .mergeMap(action => Observable.fromPromise(authService.signup(action.payload))
    .mergeMap(response => Observable.fromPromise(response.json())
    .map(result => {
    if (result.success) {
        return signupSuccess(result.result);
    }
    throw new Error(result.message);
}).catch(err => Observable.of(signupFailure(err.message)))))
    .takeUntil(action$.ofType(SIGN_UP_CANCELLED))
    .catch(error => Rx.Observable.of(signupFailure(error)));
export const AUTH_USER = "AUTH_USER";
export const AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
export const AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
const AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
export const authUser = (user) => ({ type: AUTH_USER, payload: user });
const authUserSuccess = payload => ({ type: AUTH_USER_SUCCESS, payload });
const authUserFailure = payload => ({ type: AUTH_USER_FAILURE, payload });
const authUserCancelled = () => ({ type: AUTH_USER_CANCELLED });
export const authUser_Epic = action$ => action$.ofType(AUTH_USER)
    .mergeMap(action => Rx.Observable.fromPromise(authService.auth(action.payload)))
    .mergeMap(response => Rx.Observable.from(response.json()))
    .map((result) => {
    if (result.success) {
        return authUserSuccess(result.result);
    }
    else {
        return authUserFailure(result.message);
    }
})
    .takeUntil(action$.ofType(AUTH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(authUserFailure((error.message))));
const TOKEN_AUTH_USER = "TOKEN_AUTH_USER";
export const TOKEN_AUTH_USER_SUCCESS = "TOKEN_AUTH_USER_SUCCESS";
export const TOKEN_AUTH_USER_FAILURE = "TOKEN_AUTH_USER_FAILURE";
const TOKEN_AUTH_USER_CANCELLED = "TOKEN_AUTH_USER_CANCELLED";
export const tokenAuthUser = (token) => ({ type: TOKEN_AUTH_USER, payload: token });
const tokenAuthUserSuccess = payload => ({ type: TOKEN_AUTH_USER_SUCCESS, payload });
const tokenAuthUserFailure = payload => ({ type: TOKEN_AUTH_USER_FAILURE, payload });
const tokenAuthUserCancelled = () => ({ type: TOKEN_AUTH_USER_CANCELLED });
export const tokenAuthUserEpic = action$ => (action$.ofType(TOKEN_AUTH_USER)
    .mergeMap(action => Rx.Observable.fromPromise(authService.tokenAuth(action.payload)))
    .mergeMap(response => Rx.Observable.fromPromise(response.json()))
    .map((result) => {
    if (result.success) {
        return tokenAuthUserSuccess(result.result);
    }
    else {
        return tokenAuthUserFailure(result.message);
    }
})
    .takeUntil(action$.ofType(TOKEN_AUTH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(tokenAuthUserFailure(error.message))));
const LOG_OUT = "LOG_OUT";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";
const LOG_OUT_CANCELLED = "LOG_OUT_CANCELLED";
export const logout = createAction(LOG_OUT, payload => payload);
const logoutSuccess = createAction(LOG_OUT_SUCCESS, payload => payload);
const logoutFailure = createAction(LOG_OUT_FAILURE, payload => payload);
const logoutCancelled = createAction(LOG_OUT_CANCELLED);
export const logoutUser_Epic = action$ => action$.ofType(LOG_OUT)
    .mergeMap(action => Rx.Observable.fromPromise(authService.logout(action.payload)))
    .mergeMap(response => Rx.Observable.fromPromise(response.json()))
    .map(result => {
    if (result.success) {
        AppActions.removeSession();
        stalkBridgeActions.stalkLogout();
        return logoutSuccess(result.result);
    }
    else {
        return logoutFailure(result.message);
    }
})
    .takeUntil(action$.ofType(LOG_OUT_CANCELLED))
    .catch(error => Rx.Observable.of(logoutFailure(error)));
export const AUTH_REDUCER_CLEAR_ERROR = "AUTH_REDUCER_CLEAR_ERROR";
export const clearError = createAction(AUTH_REDUCER_CLEAR_ERROR);
