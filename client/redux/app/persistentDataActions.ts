import { createAction } from "redux-actions";

import { SimpleStorageFactory } from "../../chitchat/chats/dataAccessLayer/";
const appSession = SimpleStorageFactory.getObject("app");

export async function saveSession(token: string) {
    await appSession.save("sessionToken", token);
}

export async function clearSession() {
    appSession.clear();
}

export const GET_SESSION_TOKEN_SUCCESS = "GET_SESSION_TOKEN_SUCCESS";
export const GET_SESSION_TOKEN_FAILURE = "GET_SESSION_TOKEN_FAILURE";
const getSessionTokenFailure = createAction(GET_SESSION_TOKEN_FAILURE, err => err);
const getSessionTokenSuccess = createAction(GET_SESSION_TOKEN_SUCCESS, token => token);
export function getSession() {
    return (dispatch) => {
        appSession.get("sessionToken").then(token => {
            if (!!token) {
                dispatch(getSessionTokenSuccess(token));
            }
            else {
                dispatch(getSessionTokenFailure(null));
            }
        })
            .catch(err => dispatch(getSessionTokenFailure(err)));
    };
}