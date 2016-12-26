import config from "../../configs/config";
import { Record } from "immutable";
const Rx = require('rxjs/Rx');
const { ajax } = Rx.Observable;
const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
const FETCH_USER_CANCELLED = 'FETCH_USER_CANCELLED';
export const fetchUser = (username) => ({ type: FETCH_USER, payload: username }); // username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_SUCCESS, payload });
const cancelFetchUser = () => ({ type: FETCH_USER_CANCELLED });
const fetchUserRejected = payload => ({ type: FETCH_USER_FAILURE, payload, error: true });
export const fetchUserEpic = action$ => action$.ofType(FETCH_USER)
    .mergeMap(action => ajax.getJSON(`${config.api.usersApi}/agent/${action.payload}`)
    .map(fetchUserFulfilled)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
const FETCH_CONTACT = "FETCH_CONTACT";
const FETCH_CONTACT_SUCCESS = 'FETCH_CONTACT_SUCCESS';
export const fetchContact = (contactId) => ({ type: FETCH_CONTACT, payload: contactId });
const fetchContactSuccess = payload => ({ type: FETCH_CONTACT_SUCCESS, payload });
export const fetchContactEpic = action$ => action$.ofType(FETCH_CONTACT)
    .mergeMap(action => ajax.getJSON(`${config.api.usersApi}/contact/?id=${action.payload}`)
    .map(fetchContactSuccess)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
export const UserInitState = Record({
    token: null,
    isFetching: false,
    state: null,
    user: null,
    contact: null
});
export const userReducer = (state = new UserInitState(), action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0]).set("state", FETCH_USER_SUCCESS);
        case FETCH_USER_CANCELLED:
            return state;
        case FETCH_USER_FAILURE:
            return state;
        case FETCH_CONTACT_SUCCESS:
            return state.set("contact", action.payload.result[0]).set("state", FETCH_CONTACT_SUCCESS);
        default:
            return state;
    }
};
