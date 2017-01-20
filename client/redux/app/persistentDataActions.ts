import Store from '../configureStore';

import { AppSessionToken } from '../../libs/chitchat/dataAccessLayer/AppSessionToken';
const appSession = new AppSessionToken();

export const GET_SESSION_TOKEN_SUCCESS = "GET_SESSION_TOKEN_SUCCESS";
export const GET_SESSION_TOKEN_FAILURE = "GET_SESSION_TOKEN_FAILURE";

export async function saveSession() {
    await appSession.saveSessionToken(Store.getState().authReducer.token);
}

export async function removeSession() {
    appSession.deleteSessionToken();
}

export function getSession() {
    return (dispatch) =>
        appSession.getSessionToken().then(token => {
            dispatch({ type: GET_SESSION_TOKEN_SUCCESS, payload: token });
        }).catch(err =>
            dispatch({ type: GET_SESSION_TOKEN_FAILURE, payload: err })
            );
}