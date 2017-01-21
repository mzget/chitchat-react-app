"use strict";
const config_1 = require("../../configs/config");
const immutable_1 = require("immutable");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const authRx = require("../authen/authRx");
const configureStore_1 = require("../configureStore");
const FETCH_USER = "FETCH_USER";
exports.FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
exports.FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
const FETCH_USER_CANCELLED = "FETCH_USER_CANCELLED";
exports.fetchUser = (username) => ({ type: FETCH_USER, payload: username }); // username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: exports.FETCH_USER_SUCCESS, payload });
const cancelFetchUser = () => ({ type: FETCH_USER_CANCELLED });
const fetchUserRejected = payload => ({ type: exports.FETCH_USER_FAILURE, payload, error: true });
exports.fetchUserEpic = action$ => action$.ofType(FETCH_USER)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/?username=${action.payload}`, { 'x-access-token': configureStore_1.default.getState().authReducer.token })
    .map(fetchUserFulfilled)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
const FETCH_AGENT_BY_ID = "FETCH_AGENT_BY_ID";
const FETCH_AGENT_BY_ID_SUCCESS = "FETCH_AGENT_BY_ID_SUCCESS";
const FETCH_AGENT_BY_ID_FAILURE = "FETCH_AGENT_BY_ID_FAILURE";
const FETCH_AGENT_BY_ID_CANCELLED = "FETCH_AGENT_BY_ID_CANCELLED";
const fetchAgentById = (agent_id) => ({ type: FETCH_AGENT_BY_ID, payload: agent_id });
const fetchAgentByIdSuccess = (payload) => ({ type: FETCH_AGENT_BY_ID_SUCCESS, payload });
const fetchAgentByIdFailure = (payload) => ({ type: FETCH_AGENT_BY_ID_FAILURE, payload });
const fetchAgentByIdCancelled = () => ({ type: FETCH_AGENT_BY_ID_CANCELLED });
exports.fetchAgentIdEpic = action$ => (action$.ofType(FETCH_AGENT_BY_ID)
    .margeMap(action => ajax.getJSON(`${config_1.default.api.user}/agent/${action.payload}`)
    .map(fetchAgentByIdSuccess)
    .takeUntil(action$.ofType(FETCH_AGENT_BY_ID_CANCELLED))
    .catch(error => Rx.Observable.of(fetchAgentByIdFailure(error.xhr.response)))));
const FETCH_AGENT = "FETCH_AGENT";
exports.FETCH_AGENT_SUCCESS = "FETCH_AGENT_SUCCESS";
const FETCH_AGENT_FAILURE = "FETCH_AGENT_FAILURE";
const FETCH_AGENT_CANCELLED = "FETCH_AGENT_CANCELLED";
exports.fetchAgent = (agent_id) => ({ type: FETCH_AGENT, payload: agent_id });
const fetchAgentSuccess = (payload) => ({ type: exports.FETCH_AGENT_SUCCESS, payload });
const fetchAgentFailure = (payload) => ({ type: FETCH_AGENT_FAILURE, payload });
const fetchAgentCancelled = () => ({ type: FETCH_AGENT_CANCELLED });
exports.fetchAgentEpic = action$ => (action$.ofType(FETCH_AGENT)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/agent/${action.payload}`)
    .map(fetchAgentSuccess)
    .takeUntil(action$.ofType(FETCH_AGENT_CANCELLED))
    .catch(error => Rx.Observable.of(fetchAgentFailure(error.xhr.response)))));
const FETCH_CONTACT = "FETCH_CONTACT";
const FETCH_CONTACT_SUCCESS = 'FETCH_CONTACT_SUCCESS';
exports.fetchContact = (contactId) => ({ type: FETCH_CONTACT, payload: contactId });
const fetchContactSuccess = payload => ({ type: FETCH_CONTACT_SUCCESS, payload });
exports.fetchContactEpic = action$ => action$.ofType(FETCH_CONTACT)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/contact/?id=${action.payload}`)
    .map(fetchContactSuccess)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
exports.UserInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    user: null,
    contact: null
});
const userInitState = new exports.UserInitState();
exports.userReducer = (state = userInitState, action) => {
    switch (action.type) {
        case exports.FETCH_USER_SUCCESS:
            return state.set("user", action.payload.result[0])
                .set("state", exports.FETCH_USER_SUCCESS);
        case FETCH_USER_CANCELLED:
            return state;
        case exports.FETCH_USER_FAILURE:
            return state.set('state', exports.FETCH_USER_FAILURE);
        case FETCH_CONTACT_SUCCESS:
            return state.set("contact", action.payload.result[0])
                .set("state", FETCH_CONTACT_SUCCESS);
        case exports.FETCH_AGENT_SUCCESS:
            return state.set("contact", action.payload.result[0])
                .set("state", exports.FETCH_AGENT_SUCCESS);
        case authRx.LOG_OUT_SUCCESS: {
            return userInitState;
        }
        default:
            return state;
    }
};
