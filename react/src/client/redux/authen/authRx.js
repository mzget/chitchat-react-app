"use strict";
const config_1 = require("../../configs/config");
const immutable_1 = require("immutable");
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const AppActions = require("../app/persistentDataActions");
const stalkBridgeActions = require("../../chats/redux/stalkBridge/stalkBridgeActions");
const SIGN_UP = "SIGN_UP";
exports.SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
const SIGN_UP_CANCELLED = "SIGN_UP_CANCELLED";
exports.signup = (user) => ({ type: SIGN_UP, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const signupSuccess = payload => ({ type: exports.SIGN_UP_SUCCESS, payload });
const signupFailure = payload => ({ type: SIGN_UP_FAILURE, payload, error: true });
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
const AUTH_USER = "AUTH_USER";
exports.AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
exports.AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
const AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
exports.authUser = (user) => ({ type: AUTH_USER, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const authUserSuccess = payload => ({ type: exports.AUTH_USER_SUCCESS, payload });
const authUserFailure = payload => ({ type: exports.AUTH_USER_FAILURE, payload });
const authUserCancelled = () => ({ type: AUTH_USER_CANCELLED });
exports.authUserEpic = action$ => action$.ofType(AUTH_USER).mergeMap(action => ajax({
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
const TOKEN_AUTH_USER_FAILURE = "TOKEN_AUTH_USER_FAILURE";
const TOKEN_AUTH_USER_CANCELLED = "TOKEN_AUTH_USER_CANCELLED";
exports.tokenAuthUser = (token) => ({ type: TOKEN_AUTH_USER, payload: token }); // username => ({ type: FETCH_USER, payload: username });
const tokenAuthUserSuccess = payload => ({ type: exports.TOKEN_AUTH_USER_SUCCESS, payload });
const tokenAuthUserFailure = payload => ({ type: TOKEN_AUTH_USER_FAILURE, payload });
const tokenAuthUserCancelled = () => ({ type: TOKEN_AUTH_USER_CANCELLED });
exports.tokenAuthUserEpic = action$ => action$.ofType(TOKEN_AUTH_USER).mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.auth}/verify`,
    body: JSON.stringify({ token: action.payload }),
    headers: { "Content-Type": "application/json", "x-api-key": config_1.default.api.apiKey }
})
    .map(response => tokenAuthUserSuccess(response.xhr.response))
    .takeUntil(action$.ofType(TOKEN_AUTH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(tokenAuthUserFailure((error.xhr.response) ? error.xhr.response.message : error.message))));
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
const AUTH_REDUCER_CLEAR_ERROR = "AUTH_REDUCER_CLEAR_ERROR";
exports.clearError = redux_actions_1.createAction(AUTH_REDUCER_CLEAR_ERROR);
exports.AuthenInitState = immutable_1.Record({
    token: null,
    isFetching: false,
    error: null,
    state: null,
    user: null
});
exports.authReducer = (state = new exports.AuthenInitState(), action) => {
    switch (action.type) {
        case exports.SIGN_UP_SUCCESS:
            return state.set("state", exports.SIGN_UP_SUCCESS);
        case AUTH_USER: {
            return state.set("user", action.payload.email);
        }
        case exports.AUTH_USER_SUCCESS: {
            return state.set("state", exports.AUTH_USER_SUCCESS)
                .set("token", action.payload.result);
        }
        case exports.AUTH_USER_FAILURE: {
            return state.set("state", exports.AUTH_USER_FAILURE)
                .set("token", null)
                .set("user", null)
                .set("error", JSON.stringify(action.payload));
        }
        case AppActions.GET_SESSION_TOKEN_SUCCESS: {
            return state.set("token", action.payload)
                .set("state", AppActions.GET_SESSION_TOKEN_SUCCESS);
        }
        case exports.TOKEN_AUTH_USER_SUCCESS: {
            return state.set("state", exports.TOKEN_AUTH_USER_SUCCESS)
                .set("user", action.payload.result.email);
        }
        case TOKEN_AUTH_USER_FAILURE: {
            return state.set("token", null)
                .set("error", JSON.stringify(action.payload))
                .set("state", TOKEN_AUTH_USER_FAILURE);
        }
        case exports.LOG_OUT_SUCCESS: {
            return state.set("state", exports.LOG_OUT_SUCCESS)
                .set("token", null)
                .set("user", null);
        }
        case AUTH_REDUCER_CLEAR_ERROR: {
            return state.set("error", null).set("state", AUTH_REDUCER_CLEAR_ERROR);
        }
        default:
            return state;
    }
};
