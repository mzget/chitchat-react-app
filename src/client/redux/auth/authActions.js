var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import config from "../../configs/config";
import { createAction, handleActions } from 'redux-actions';
const Rx = require('rxjs/Rx');
const { ajax } = Rx.Observable;
export const AUTH_REQUEST = "AUTH_REQUEST";
export const AuthInitState = {
    token: null,
    isFetching: false,
    state: null
};
export const authReducer = handleActions({
    AUTH_REQUEST: (state, action) => (__assign({ isFetching: true }, state)),
}, AuthInitState);
let auth_request = createAction(AUTH_REQUEST);
const FETCH_USER = 'FETCH_USER';
const FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED';
const FETCH_USER_REJECTED = 'FETCH_USER_REJECTED';
const FETCH_USER_CANCELLED = 'FETCH_USER_CANCELLED';
export const fetchUser = username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_FULFILLED, payload });
const cancelFetchUser = () => ({ type: FETCH_USER_CANCELLED });
//
export const fetchUserEpic = action$ => action$.ofType(FETCH_USER)
    .mergeMap(action => ajax.getJSON(`${config.api.usersApi}/${action.payload}`)
    .map(fetchUserFulfilled)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED)));
export const usersReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_USER_FULFILLED:
            console.log(FETCH_USER_FULFILLED, action.payload);
            return __assign({}, state, { 
                // `login` is the username
                [action.payload.login]: action.payload });
        case FETCH_USER_FULFILLED:
        case FETCH_USER_CANCELLED:
            return false;
        default:
            return state;
    }
};
