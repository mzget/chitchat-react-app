"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const configureStore_1 = require("../configureStore");
const AppSessionToken_1 = require("../../libs/chitchat/dataAccessLayer/AppSessionToken");
const appSession = new AppSessionToken_1.AppSessionToken();
exports.GET_SESSION_TOKEN_SUCCESS = "GET_SESSION_TOKEN_SUCCESS";
exports.GET_SESSION_TOKEN_FAILURE = "GET_SESSION_TOKEN_FAILURE";
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
function getSession() {
    return (dispatch) => appSession.getSessionToken().then(token => {
        dispatch({ type: exports.GET_SESSION_TOKEN_SUCCESS, payload: token });
    }).catch(err => dispatch({ type: exports.GET_SESSION_TOKEN_FAILURE, payload: err }));
}
exports.getSession = getSession;
