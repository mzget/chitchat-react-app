import { createAction } from "redux-actions";

import store from "../configureStore";

import { AppSessionToken } from "../../chitchat/chats/dataAccessLayer/AppSessionToken";
const appSession = new AppSessionToken();


export async function saveSession() {
    await appSession.saveSessionToken(store.getState().authReducer.token);
}

export async function removeSession() {
    appSession.deleteSessionToken();
}

export const GET_SESSION_TOKEN_SUCCESS = "GET_SESSION_TOKEN_SUCCESS";
export const GET_SESSION_TOKEN_FAILURE = "GET_SESSION_TOKEN_FAILURE";
const getSessionTokenFailure = createAction(GET_SESSION_TOKEN_FAILURE, err => err);
const getSessionTokenSuccess = createAction(GET_SESSION_TOKEN_SUCCESS, token => token);
export function getSession() {
    return (dispatch) => {
        appSession.getSessionToken().then(token => {
            if (!!token)
                dispatch(getSessionTokenSuccess(token));
            else
                dispatch(getSessionTokenFailure(null));
        }).catch(err => dispatch(getSessionTokenFailure(err)));
    };
}