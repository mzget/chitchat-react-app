"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../configs/config");
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const AppActions = require("../app/persistentDataActions");
const stalkBridgeActions = require("../../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
const SIGN_UP = "SIGN_UP";
exports.SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
exports.SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
const SIGN_UP_CANCELLED = "SIGN_UP_CANCELLED";
exports.signup = (user) => ({ type: SIGN_UP, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const signupSuccess = payload => ({ type: exports.SIGN_UP_SUCCESS, payload });
const signupFailure = payload => ({ type: exports.SIGN_UP_FAILURE, payload });
const signupCancelled = () => ({ type: SIGN_UP_CANCELLED });
exports.signupUserEpic = action$ => action$.ofType(SIGN_UP)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.user}/signup`,
    body: JSON.stringify({ user: action.payload }),
    headers: { "Content-Type": "application/json", "x-api-key": config_1.default.api.apiKey }
})
    .map(response => signupSuccess(response.xhr.response))
    .takeUntil(action$.ofType(SIGN_UP_CANCELLED))
    .catch(error => Rx.Observable.of(signupFailure(error.xhr.response))));
exports.AUTH_USER = "AUTH_USER";
exports.AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
exports.AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
const AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
exports.authUser = (user) => ({ type: exports.AUTH_USER, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const authUserSuccess = payload => ({ type: exports.AUTH_USER_SUCCESS, payload });
const authUserFailure = payload => ({ type: exports.AUTH_USER_FAILURE, payload });
const authUserCancelled = () => ({ type: AUTH_USER_CANCELLED });
exports.authUserEpic = action$ => action$.ofType(exports.AUTH_USER).mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.auth}`,
    body: JSON.stringify(action.payload),
    headers: { "Content-Type": "application/json", "x-api-key": config_1.default.api.apiKey }
})
    .map(response => authUserSuccess(response.xhr.response))
    .takeUntil(action$.ofType(AUTH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(authUserFailure((error.xhr.response) ? error.xhr.response.message : error.message))));
const TOKEN_AUTH_USER = "TOKEN_AUTH_USER";
exports.TOKEN_AUTH_USER_SUCCESS = "TOKEN_AUTH_USER_SUCCESS";
exports.TOKEN_AUTH_USER_FAILURE = "TOKEN_AUTH_USER_FAILURE";
const TOKEN_AUTH_USER_CANCELLED = "TOKEN_AUTH_USER_CANCELLED";
exports.tokenAuthUser = (token) => ({ type: TOKEN_AUTH_USER, payload: token }); // username => ({ type: FETCH_USER, payload: username });
const tokenAuthUserSuccess = payload => ({ type: exports.TOKEN_AUTH_USER_SUCCESS, payload });
const tokenAuthUserFailure = payload => ({ type: exports.TOKEN_AUTH_USER_FAILURE, payload });
const tokenAuthUserCancelled = () => ({ type: TOKEN_AUTH_USER_CANCELLED });
exports.tokenAuthUserEpic = action$ => (action$.ofType(TOKEN_AUTH_USER)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.auth}/verify`,
    body: JSON.stringify({ token: action.payload }),
    headers: { "Content-Type": "application/json" }
})
    .map(response => tokenAuthUserSuccess(response.xhr.response))
    .takeUntil(action$.ofType(TOKEN_AUTH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(tokenAuthUserFailure((error.xhr.response) ? error.xhr.response.message : error.message)))));
const LOG_OUT = "LOG_OUT";
exports.LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";
const LOG_OUT_CANCELLED = "LOG_OUT_CANCELLED";
exports.logout = redux_actions_1.createAction(LOG_OUT, payload => payload);
const logoutSuccess = redux_actions_1.createAction(exports.LOG_OUT_SUCCESS, payload => payload);
const logoutFailure = redux_actions_1.createAction(LOG_OUT_FAILURE, payload => payload);
const logoutCancelled = redux_actions_1.createAction(LOG_OUT_CANCELLED);
exports.logoutUserEpic = action$ => action$.ofType(LOG_OUT)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.auth}/logout`,
    headers: { "Content-Type": "application/json", "x-access-token": action.payload }
}).map(response => {
    AppActions.removeSession();
    stalkBridgeActions.stalkLogout();
    return logoutSuccess(response.xhr.response);
})
    .takeUntil(action$.ofType(LOG_OUT_CANCELLED))
    .catch(error => Rx.Observable.of(logoutFailure(error.xhr.response))));
exports.AUTH_REDUCER_CLEAR_ERROR = "AUTH_REDUCER_CLEAR_ERROR";
exports.clearError = redux_actions_1.createAction(exports.AUTH_REDUCER_CLEAR_ERROR);
