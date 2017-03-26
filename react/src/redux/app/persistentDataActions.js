"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const redux_actions_1 = require("redux-actions");
const configureStore_1 = require("../configureStore");
const AppSessionToken_1 = require("../../chats/dataAccessLayer/AppSessionToken");
const appSession = new AppSessionToken_1.AppSessionToken();
function saveSession() {
    return __awaiter(this, void 0, void 0, function* () {
        yield appSession.saveSessionToken(configureStore_1.default.getState().authReducer.token);
    });
}
exports.saveSession = saveSession;
function removeSession() {
    return __awaiter(this, void 0, void 0, function* () {
        appSession.deleteSessionToken();
    });
}
exports.removeSession = removeSession;
exports.GET_SESSION_TOKEN_SUCCESS = "GET_SESSION_TOKEN_SUCCESS";
exports.GET_SESSION_TOKEN_FAILURE = "GET_SESSION_TOKEN_FAILURE";
const getSessionTokenFailure = redux_actions_1.createAction(exports.GET_SESSION_TOKEN_FAILURE, err => err);
const getSessionTokenSuccess = redux_actions_1.createAction(exports.GET_SESSION_TOKEN_SUCCESS, token => token);
function getSession() {
    return (dispatch) => {
        appSession.getSessionToken().then(token => {
            if (!!token)
                dispatch(getSessionTokenSuccess(token));
            else
                dispatch(getSessionTokenFailure(null));
        }).catch(err => dispatch(getSessionTokenFailure(err)));
    };
}
exports.getSession = getSession;
