import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import * as UserService from "../../chats/services/UserService";
import Store from "../configureStore";

const FETCH_USER = "FETCH_USER";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
export const FETCH_USER_CANCELLED = "FETCH_USER_CANCELLED";

export const fetchUser = (username) => ({ type: FETCH_USER, payload: username }); // username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_SUCCESS, payload });
const cancelFetchUser = () => ({ type: FETCH_USER_CANCELLED });
const fetchUserRejected = payload => ({ type: FETCH_USER_FAILURE, payload, error: true });
export const fetchUserEpic = action$ => (
    action$.ofType(FETCH_USER).mergeMap(action =>
        ajax.getJSON(`${config.api.user}/?username=${action.payload}`,
            { "x-access-token": Store.getState().authReducer.token }
        ).map(fetchUserFulfilled)
            .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
            .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))))
);

const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
export const UPDATE_USER_PROFILE_SUCCESS = "UPDATE_USER_PROFILE_SUCCESS";
export const UPDATE_USER_PROFILE_FAILURE = "UPDATE_USER_PROFILE_FAILURE";
export const UPDATE_USER_PROFILE_CANCELLED = "UPDATE_USER_PROFILE_CANCELLED";

const FETCH_AGENT_BY_ID = "FETCH_AGENT_BY_ID";
const FETCH_AGENT_BY_ID_SUCCESS = "FETCH_AGENT_BY_ID_SUCCESS";
const FETCH_AGENT_BY_ID_FAILURE = "FETCH_AGENT_BY_ID_FAILURE";
const FETCH_AGENT_BY_ID_CANCELLED = "FETCH_AGENT_BY_ID_CANCELLED";
const fetchAgentById = (agent_id: string) => ({ type: FETCH_AGENT_BY_ID, payload: agent_id });
const fetchAgentByIdSuccess = (payload) => ({ type: FETCH_AGENT_BY_ID_SUCCESS, payload });
const fetchAgentByIdFailure = (payload) => ({ type: FETCH_AGENT_BY_ID_FAILURE, payload });
const fetchAgentByIdCancelled = () => ({ type: FETCH_AGENT_BY_ID_CANCELLED });
export const fetchAgentIdEpic = action$ => (action$.ofType(FETCH_AGENT_BY_ID)
    .margeMap(action => ajax.getJSON(`${config.api.user}/agent/${action.payload}`)
        .map(fetchAgentByIdSuccess)
        .takeUntil(action$.ofType(FETCH_AGENT_BY_ID_CANCELLED))
        .catch(error => Rx.Observable.of(fetchAgentByIdFailure(error.xhr.response))))
);

const FETCH_AGENT = "FETCH_AGENT";
export const FETCH_AGENT_SUCCESS = "FETCH_AGENT_SUCCESS";
const FETCH_AGENT_FAILURE = "FETCH_AGENT_FAILURE";
const FETCH_AGENT_CANCELLED = "FETCH_AGENT_CANCELLED";
export const fetchAgent = (agent_id: string) => ({ type: FETCH_AGENT, payload: agent_id });
const fetchAgentSuccess = (payload) => ({ type: FETCH_AGENT_SUCCESS, payload });
const fetchAgentFailure = (payload) => ({ type: FETCH_AGENT_FAILURE, payload });
const fetchAgentCancelled = () => ({ type: FETCH_AGENT_CANCELLED });
export const fetchAgentEpic = action$ => (
    action$.ofType(FETCH_AGENT)
        .mergeMap(action =>
            ajax.getJSON(`${config.api.user}/agent/${action.payload}`)
                .map(fetchAgentSuccess)
                .takeUntil(action$.ofType(FETCH_AGENT_CANCELLED))
                .catch(error => Rx.Observable.of(fetchAgentFailure(error.xhr.response))))
);

const FETCH_CONTACT = "FETCH_CONTACT";
const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";

export const fetchContact = (contactId: string) => ({ type: FETCH_CONTACT, payload: contactId });
const fetchContactSuccess = payload => ({ type: FETCH_CONTACT_SUCCESS, payload });
export const fetchContactEpic = action$ => action$.ofType(FETCH_CONTACT)
    .mergeMap(action =>
        ajax.getJSON(`${config.api.user}/contact/?id=${action.payload}`)
            .map(fetchContactSuccess)
            .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
            .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response)))
    );


const GET_TEAM_PROFILE = "GET_TEAM_PROFILE";
export const GET_TEAM_PROFILE_SUCCESS = "GET_TEAM_PROFILE_SUCCESS";
export const GET_TEAM_PROFILE_FAILURE = "GET_TEAM_PROFILE_FAILURE";
const GET_TEAM_PROFILE_CANCELLED = "GET_TEAM_PROFILE_CANCELLED";

export const getTeamProfile = (team_id: string) => ({ type: GET_TEAM_PROFILE, payload: team_id });
const getTeamProfileSuccess = (payload) => ({ type: GET_TEAM_PROFILE_SUCCESS, payload });
const getTeamProfileFailure = (payload) => ({ type: GET_TEAM_PROFILE_FAILURE, payload });
const getTeamProfileCancelled = () => ({ type: GET_TEAM_PROFILE_CANCELLED });
export const getTeamProfileEpic = action$ => (
    action$.ofType(GET_TEAM_PROFILE)
        .mergeMap(action => {
            let token = Store.getState().authReducer.token;
            return UserService.getTeamProfile(token, action.payload);
        })
        .map(result => getTeamProfileSuccess(result.response.result))
        .takeUntil(action$.ofType(GET_TEAM_PROFILE_CANCELLED))
        .catch(error => Rx.Observable.of(getTeamProfileFailure(error.xhr.response)))
);