"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../configs/config");
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const UserService = require("../../chats/services/UserService");
const configureStore_1 = require("../configureStore");
const FETCH_USER = "FETCH_USER";
exports.FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
exports.FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
exports.FETCH_USER_CANCELLED = "FETCH_USER_CANCELLED";
exports.fetchUser = (username) => ({ type: FETCH_USER, payload: username }); // username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: exports.FETCH_USER_SUCCESS, payload });
const cancelFetchUser = () => ({ type: exports.FETCH_USER_CANCELLED });
const fetchUserRejected = payload => ({ type: exports.FETCH_USER_FAILURE, payload, error: true });
exports.fetchUserEpic = action$ => (action$.ofType(FETCH_USER).mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/?username=${action.payload}`, { "x-access-token": configureStore_1.default.getState().authReducer.token }).map(fetchUserFulfilled)
    .takeUntil(action$.ofType(exports.FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response)))));
const UPDATE_USER_INFO = "UPDATE_USER_INFO";
exports.UPDATE_USER_INFO_SUCCESS = "UPDATE_USER_INFO_SUCCESS";
exports.UPDATE_USER_INFO_FAILURE = "UPDATE_USER_INFO_FAILURE";
exports.UPDATE_USER_INFO_CANCELLED = "UPDATE_USER_INFO_CANCELLED";
exports.updateUserInfo = redux_actions_1.createAction(UPDATE_USER_INFO, (user) => user);
exports.updateUserInfoSuccess = redux_actions_1.createAction(exports.UPDATE_USER_INFO_SUCCESS, (result) => result);
exports.updateUserInfoFailure = redux_actions_1.createAction(exports.UPDATE_USER_INFO_FAILURE, (error) => error);
exports.updateUserInfoCancelled = redux_actions_1.createAction(exports.UPDATE_USER_INFO_CANCELLED);
exports.updateUserInfo_Epic = action$ => (action$.ofType(UPDATE_USER_INFO).mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.user}/userInfo`,
    body: JSON.stringify({ user: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
}).map(json => exports.updateUserInfoSuccess(json.response.result))
    .takeUntil(action$.ofType(exports.UPDATE_USER_INFO_CANCELLED))
    .catch(error => Rx.Observable.of(exports.updateUserInfoFailure(error.xhr.response)))));
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
const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";
exports.fetchContact = (contactId) => ({ type: FETCH_CONTACT, payload: contactId });
const fetchContactSuccess = payload => ({ type: FETCH_CONTACT_SUCCESS, payload });
exports.fetchContactEpic = action$ => action$.ofType(FETCH_CONTACT)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/contact/?id=${action.payload}`)
    .map(fetchContactSuccess)
    .takeUntil(action$.ofType(exports.FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
const GET_TEAM_PROFILE = "GET_TEAM_PROFILE";
exports.GET_TEAM_PROFILE_SUCCESS = "GET_TEAM_PROFILE_SUCCESS";
exports.GET_TEAM_PROFILE_FAILURE = "GET_TEAM_PROFILE_FAILURE";
const GET_TEAM_PROFILE_CANCELLED = "GET_TEAM_PROFILE_CANCELLED";
exports.getTeamProfile = (team_id) => ({ type: GET_TEAM_PROFILE, payload: team_id });
const getTeamProfileSuccess = (payload) => ({ type: exports.GET_TEAM_PROFILE_SUCCESS, payload });
const getTeamProfileFailure = (payload) => ({ type: exports.GET_TEAM_PROFILE_FAILURE, payload });
const getTeamProfileCancelled = () => ({ type: GET_TEAM_PROFILE_CANCELLED });
exports.getTeamProfileEpic = action$ => (action$.ofType(GET_TEAM_PROFILE)
    .mergeMap(action => {
    let token = configureStore_1.default.getState().authReducer.token;
    return UserService.getTeamProfile(token, action.payload);
})
    .map(result => getTeamProfileSuccess(result.response.result))
    .takeUntil(action$.ofType(GET_TEAM_PROFILE_CANCELLED))
    .catch(error => Rx.Observable.of(getTeamProfileFailure(error.xhr.response))));
const UPLOAD_USER_AVATAR = "UPLOAD_USER_AVATAR";
exports.UPLOAD_USER_AVATAR_SUCCESS = "UPLOAD_USER_AVATAR_SUCCESS";
exports.UPLOAD_USER_AVATAR_FAILURE = "UPLOAD_USER_AVATAR_FAILURE";
const UPLOAD_USER_AVATAR_CANCELLED = "UPLOAD_USER_AVATAR_CANCELLED";
exports.uploadUserAvatar = redux_actions_1.createAction(UPLOAD_USER_AVATAR, file => file);
exports.uploadUserAvatarSuccess = redux_actions_1.createAction(exports.UPLOAD_USER_AVATAR_SUCCESS, result => result);
exports.uploadUserAvatarFailure = redux_actions_1.createAction(exports.UPLOAD_USER_AVATAR_FAILURE, error => error);
exports.uploadUserAvatarCancelled = redux_actions_1.createAction(UPLOAD_USER_AVATAR_CANCELLED);
exports.uploadUserAvatar_Epic = action$ => (action$.ofType(UPLOAD_USER_AVATAR)
    .mergeMap(action => {
    let body = new FormData();
    body.append("file", action.payload);
    return ajax({
        method: "POST",
        url: `${config_1.default.api.user}/uploadImage`,
        body: body,
        headers: {
            "x-access-token": configureStore_1.default.getState().authReducer.token
        }
    });
})
    .map(json => exports.uploadUserAvatarSuccess(json.response))
    .takeUntil(action$.ofType(UPLOAD_USER_AVATAR_CANCELLED))
    .catch(error => Rx.Observable.of(exports.uploadUserAvatarFailure(error.xhr.response))));
exports.USERRX_EMPTY_STATE = "USERRX_EMPTY_STATE";
exports.emptyState = redux_actions_1.createAction(exports.USERRX_EMPTY_STATE);
