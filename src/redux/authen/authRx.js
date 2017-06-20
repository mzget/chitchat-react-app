"use strict";
exports.__esModule = true;
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs/Rx");
var Observable = Rx.Observable;
var ajax = Observable.ajax, fromPromise = Observable.fromPromise;
var authService = require("../../chitchat/chats/services/authService");
var AppActions = require("../app/persistentDataActions");
var stalkBridgeActions = require("../../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
var SIGN_UP = "SIGN_UP";
exports.SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
exports.SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
var SIGN_UP_CANCELLED = "SIGN_UP_CANCELLED";
exports.signup = function (user) { return ({ type: SIGN_UP, payload: user }); }; // username => ({ type: FETCH_USER, payload: username });
var signupSuccess = function (payload) { return ({ type: exports.SIGN_UP_SUCCESS, payload: payload }); };
var signupFailure = function (payload) { return ({ type: exports.SIGN_UP_FAILURE, payload: payload }); };
var signupCancelled = function () { return ({ type: SIGN_UP_CANCELLED }); };
exports.signupUserEpic = function (action$) {
    return action$.ofType(SIGN_UP)
        .mergeMap(function (action) { return Observable.fromPromise(authService.signup(action.payload))
        .mergeMap(function (response) { return Observable.fromPromise(response.json())
        .map(function (result) {
        if (result.success) {
            return signupSuccess(result.result);
        }
        throw new Error(result.message);
    })["catch"](function (err) { return Observable.of(signupFailure(err.message)); }); }); })
        .takeUntil(action$.ofType(SIGN_UP_CANCELLED))["catch"](function (error) { return Rx.Observable.of(signupFailure(error)); });
};
exports.AUTH_USER = "AUTH_USER";
exports.AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
exports.AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
var AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
exports.authUser = function (user) { return ({ type: exports.AUTH_USER, payload: user }); }; // username => ({ type: FETCH_USER, payload: username });
var authUserSuccess = function (payload) { return ({ type: exports.AUTH_USER_SUCCESS, payload: payload }); };
var authUserFailure = function (payload) { return ({ type: exports.AUTH_USER_FAILURE, payload: payload }); };
var authUserCancelled = function () { return ({ type: AUTH_USER_CANCELLED }); };
exports.authUser_Epic = function (action$) {
    return action$.ofType(exports.AUTH_USER)
        .mergeMap(function (action) { return Rx.Observable.fromPromise(authService.auth(action.payload)); })
        .mergeMap(function (response) { return Rx.Observable.from(response.json()); })
        .map(function (result) {
        if (result.success) {
            return authUserSuccess(result.result);
        }
        else {
            return authUserFailure(result.message);
        }
    })
        .takeUntil(action$.ofType(AUTH_USER_CANCELLED))["catch"](function (error) {
        return Rx.Observable.of(authUserFailure((error.message)));
    });
};
var TOKEN_AUTH_USER = "TOKEN_AUTH_USER";
exports.TOKEN_AUTH_USER_SUCCESS = "TOKEN_AUTH_USER_SUCCESS";
exports.TOKEN_AUTH_USER_FAILURE = "TOKEN_AUTH_USER_FAILURE";
var TOKEN_AUTH_USER_CANCELLED = "TOKEN_AUTH_USER_CANCELLED";
exports.tokenAuthUser = function (token) { return ({ type: TOKEN_AUTH_USER, payload: token }); }; // username => ({ type: FETCH_USER, payload: username });
var tokenAuthUserSuccess = function (payload) { return ({ type: exports.TOKEN_AUTH_USER_SUCCESS, payload: payload }); };
var tokenAuthUserFailure = function (payload) { return ({ type: exports.TOKEN_AUTH_USER_FAILURE, payload: payload }); };
var tokenAuthUserCancelled = function () { return ({ type: TOKEN_AUTH_USER_CANCELLED }); };
exports.tokenAuthUserEpic = function (action$) { return (action$.ofType(TOKEN_AUTH_USER)
    .mergeMap(function (action) { return Rx.Observable.fromPromise(authService.tokenAuth(action.payload)); })
    .mergeMap(function (response) { return Rx.Observable.fromPromise(response.json()); })
    .map(function (result) {
    if (result.success) {
        return tokenAuthUserSuccess(result.result);
    }
    else {
        return tokenAuthUserFailure(result.message);
    }
})
    .takeUntil(action$.ofType(TOKEN_AUTH_USER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(tokenAuthUserFailure(error.message)); })); };
var LOG_OUT = "LOG_OUT";
exports.LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
var LOG_OUT_FAILURE = "LOG_OUT_FAILURE";
var LOG_OUT_CANCELLED = "LOG_OUT_CANCELLED";
exports.logout = redux_actions_1.createAction(LOG_OUT, function (payload) { return payload; });
var logoutSuccess = redux_actions_1.createAction(exports.LOG_OUT_SUCCESS, function (payload) { return payload; });
var logoutFailure = redux_actions_1.createAction(LOG_OUT_FAILURE, function (payload) { return payload; });
var logoutCancelled = redux_actions_1.createAction(LOG_OUT_CANCELLED);
exports.logoutUser_Epic = function (action$) { return action$.ofType(LOG_OUT)
    .mergeMap(function (action) { return Rx.Observable.fromPromise(authService.logout(action.payload)); })
    .mergeMap(function (response) { return Rx.Observable.fromPromise(response.json()); })
    .map(function (result) {
    if (result.success) {
        AppActions.removeSession();
        stalkBridgeActions.stalkLogout();
        return logoutSuccess(result.result);
    }
    else {
        return logoutFailure(result.message);
    }
})
    .takeUntil(action$.ofType(LOG_OUT_CANCELLED))["catch"](function (error) { return Rx.Observable.of(logoutFailure(error)); }); };
exports.AUTH_REDUCER_CLEAR_ERROR = "AUTH_REDUCER_CLEAR_ERROR";
exports.clearError = redux_actions_1.createAction(exports.AUTH_REDUCER_CLEAR_ERROR);
