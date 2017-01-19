import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from 'rxjs/Rx';
const { ajax } = Rx.Observable;


const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
const SIGN_UP_CANCELLED = 'SIGN_UP_CANCELLED';

export const signup = (user) => ({ type: SIGN_UP, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const signupSuccess = payload => ({ type: SIGN_UP_SUCCESS, payload });
const signupFailure = payload => ({ type: SIGN_UP_FAILURE, payload, error: true });
const signupCancelled = () => ({ type: SIGN_UP_CANCELLED });

export const signupUserEpic = action$ =>
    action$.ofType(SIGN_UP).mergeMap(action => ajax({
        method: 'POST',
        url: `${config.api.user}/signup`,
        body: JSON.stringify({ user: action.payload }),
        headers: { 'Content-Type': 'application/json' }
    })
        .map(response => signupSuccess(response.xhr.response))
        .takeUntil(action$.ofType(SIGN_UP_CANCELLED))
        .catch(error => Rx.Observable.of(signupFailure(error.xhr.response)))
    );

const AUTH_USER = "AUTH_USER";
export const AUTH_USER_SUCCESS = "AUTH_USER_SUCCESS";
const AUTH_USER_FAILURE = "AUTH_USER_FAILURE";
const AUTH_USER_CANCELLED = "AUTH_USER_CANCELLED";
export const authUser = (user: { email: string, password: string }) => ({ type: AUTH_USER, payload: user }); // username => ({ type: FETCH_USER, payload: username });
const authUserSuccess = payload => ({ type: AUTH_USER_SUCCESS, payload });
const authUserFailure = payload => ({ type: AUTH_USER_FAILURE, payload, error: true });
const authUserCancelled = () => ({ type: AUTH_USER_CANCELLED });
export const authUserEpic = action$ =>
    action$.ofType(AUTH_USER).mergeMap(action => ajax({
        method: 'POST',
        url: `${config.api.auth}`,
        body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json' }
    })
        .map(response => authUserSuccess(response.xhr.response))
        .takeUntil(action$.ofType(AUTH_USER_CANCELLED))
        .catch(error => Rx.Observable.of(authUserFailure(error.xhr.response)))
    );

export const AuthenInitState = Record({
    token: null,
    isFetching: false,
    state: null,
    user: null
});
export const authReducer = (state = new AuthenInitState(), action) => {
    switch (action.type) {
        case SIGN_UP_SUCCESS:
            return state.set('state', SIGN_UP_SUCCESS);

        case AUTH_USER: {
            return state.set('user', action.payload.email);
        }
        case AUTH_USER_SUCCESS: {
            return state.set('state', AUTH_USER_SUCCESS)
                .set('token', action.payload.result);
        }
        case AUTH_USER_FAILURE: {
            return state.set('state', AUTH_USER_FAILURE)
                .set('token', null)
                .set('user', null);
        }

        default:
            return state;
    }
};