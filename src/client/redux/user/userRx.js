import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { ChitChatFactory } from "../../chitchat/chats/chitchatFactory";
const config = () => ChitChatFactory.getInstance().config;
import * as UserService from "../../chitchat/chats/services/UserService";
import * as StalkBridgeActions from "../../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import { AUTH_USER_SUCCESS, TOKEN_AUTH_USER_SUCCESS } from "../authen/authRx";
import Store from "../configureStore";
export const onAuth_Epic = action$ => action$.filter(action => (action.type === AUTH_USER_SUCCESS || action.type === TOKEN_AUTH_USER_SUCCESS))
    .map(response => fetchUser(Store.getState().authReducer.user));
const FETCH_USER = "FETCH_USER";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
export const FETCH_USER_CANCELLED = "FETCH_USER_CANCELLED";
export const fetchUser = (username) => ({ type: FETCH_USER, payload: username }); // username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_SUCCESS, payload });
const cancelFetchUser = () => ({ type: FETCH_USER_CANCELLED });
const fetchUserRejected = payload => ({ type: FETCH_USER_FAILURE, payload });
export const fetchUser_Epic = action$ => action$.ofType(FETCH_USER)
    .mergeMap(action => UserService.fetchUser(action.payload)
    .map(response => fetchUserFulfilled(response.xhr.response))
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response)))
    ._do(x => {
    if (x.type == FETCH_USER_SUCCESS) {
        if (x.payload.result && x.payload.result.length > 0) {
            let user = x.payload.result[0];
            let stalkReducer = Store.getState().stalkReducer;
            if (stalkReducer.state !== StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(user);
            }
        }
    }
}));
const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const UPDATE_USER_INFO_SUCCESS = "UPDATE_USER_INFO_SUCCESS";
export const UPDATE_USER_INFO_FAILURE = "UPDATE_USER_INFO_FAILURE";
export const UPDATE_USER_INFO_CANCELLED = "UPDATE_USER_INFO_CANCELLED";
export const updateUserInfo = createAction(UPDATE_USER_INFO, (user) => user);
export const updateUserInfoSuccess = createAction(UPDATE_USER_INFO_SUCCESS, (result) => result);
export const updateUserInfoFailure = createAction(UPDATE_USER_INFO_FAILURE, (error) => error);
export const updateUserInfoCancelled = createAction(UPDATE_USER_INFO_CANCELLED);
export const updateUserInfo_Epic = action$ => (action$.ofType(UPDATE_USER_INFO).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.user}/userInfo`,
    body: JSON.stringify({ user: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
}).map(json => updateUserInfoSuccess(json.response.result))
    .takeUntil(action$.ofType(UPDATE_USER_INFO_CANCELLED))
    .catch(error => Rx.Observable.of(updateUserInfoFailure(error.xhr.response)))));
const FETCH_AGENT_BY_ID = "FETCH_AGENT_BY_ID";
const FETCH_AGENT_BY_ID_SUCCESS = "FETCH_AGENT_BY_ID_SUCCESS";
const FETCH_AGENT_BY_ID_FAILURE = "FETCH_AGENT_BY_ID_FAILURE";
const FETCH_AGENT_BY_ID_CANCELLED = "FETCH_AGENT_BY_ID_CANCELLED";
const fetchAgentById = (agent_id) => ({ type: FETCH_AGENT_BY_ID, payload: agent_id });
const fetchAgentByIdSuccess = (payload) => ({ type: FETCH_AGENT_BY_ID_SUCCESS, payload });
const fetchAgentByIdFailure = (payload) => ({ type: FETCH_AGENT_BY_ID_FAILURE, payload });
const fetchAgentByIdCancelled = () => ({ type: FETCH_AGENT_BY_ID_CANCELLED });
export const fetchAgentIdEpic = action$ => (action$.ofType(FETCH_AGENT_BY_ID)
    .margeMap(action => ajax.getJSON(`${config().api.user}/agent/${action.payload}`)
    .map(fetchAgentByIdSuccess)
    .takeUntil(action$.ofType(FETCH_AGENT_BY_ID_CANCELLED))
    .catch(error => Rx.Observable.of(fetchAgentByIdFailure(error.xhr.response)))));
const FETCH_AGENT = "FETCH_AGENT";
export const FETCH_AGENT_SUCCESS = "FETCH_AGENT_SUCCESS";
const FETCH_AGENT_FAILURE = "FETCH_AGENT_FAILURE";
const FETCH_AGENT_CANCELLED = "FETCH_AGENT_CANCELLED";
export const fetchAgent = (agent_id) => ({ type: FETCH_AGENT, payload: agent_id });
const fetchAgentSuccess = (payload) => ({ type: FETCH_AGENT_SUCCESS, payload });
const fetchAgentFailure = (payload) => ({ type: FETCH_AGENT_FAILURE, payload });
const fetchAgentCancelled = () => ({ type: FETCH_AGENT_CANCELLED });
export const fetchAgentEpic = action$ => (action$.ofType(FETCH_AGENT)
    .mergeMap(action => ajax.getJSON(`${config().api.user}/agent/${action.payload}`)
    .map(fetchAgentSuccess)
    .takeUntil(action$.ofType(FETCH_AGENT_CANCELLED))
    .catch(error => Rx.Observable.of(fetchAgentFailure(error.xhr.response)))));
const FETCH_CONTACT = "FETCH_CONTACT";
const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";
export const fetchContact = (contactId) => ({ type: FETCH_CONTACT, payload: contactId });
const fetchContactSuccess = payload => ({ type: FETCH_CONTACT_SUCCESS, payload });
export const fetchContactEpic = action$ => action$.ofType(FETCH_CONTACT)
    .mergeMap(action => ajax.getJSON(`${config().api.user}/contact/?id=${action.payload}`)
    .map(fetchContactSuccess)
    .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserRejected(error.xhr.response))));
const GET_TEAM_PROFILE = "GET_TEAM_PROFILE";
export const GET_TEAM_PROFILE_SUCCESS = "GET_TEAM_PROFILE_SUCCESS";
export const GET_TEAM_PROFILE_FAILURE = "GET_TEAM_PROFILE_FAILURE";
const GET_TEAM_PROFILE_CANCELLED = "GET_TEAM_PROFILE_CANCELLED";
export const getTeamProfile = (team_id) => ({ type: GET_TEAM_PROFILE, payload: team_id });
const getTeamProfileSuccess = (payload) => ({ type: GET_TEAM_PROFILE_SUCCESS, payload });
const getTeamProfileFailure = (payload) => ({ type: GET_TEAM_PROFILE_FAILURE, payload });
const getTeamProfileCancelled = () => ({ type: GET_TEAM_PROFILE_CANCELLED });
export const getTeamProfileEpic = action$ => (action$.ofType(GET_TEAM_PROFILE)
    .mergeMap(action => {
    let token = Store.getState().authReducer.token;
    return UserService.getTeamProfile(token, action.payload);
})
    .map(result => getTeamProfileSuccess(result.response.result))
    .takeUntil(action$.ofType(GET_TEAM_PROFILE_CANCELLED))
    .catch(error => Rx.Observable.of(getTeamProfileFailure(error.xhr.response))));
const UPLOAD_USER_AVATAR = "UPLOAD_USER_AVATAR";
export const UPLOAD_USER_AVATAR_SUCCESS = "UPLOAD_USER_AVATAR_SUCCESS";
export const UPLOAD_USER_AVATAR_FAILURE = "UPLOAD_USER_AVATAR_FAILURE";
const UPLOAD_USER_AVATAR_CANCELLED = "UPLOAD_USER_AVATAR_CANCELLED";
export const uploadUserAvatar = createAction(UPLOAD_USER_AVATAR, file => file);
export const uploadUserAvatarSuccess = createAction(UPLOAD_USER_AVATAR_SUCCESS, result => result);
export const uploadUserAvatarFailure = createAction(UPLOAD_USER_AVATAR_FAILURE, error => error);
export const uploadUserAvatarCancelled = createAction(UPLOAD_USER_AVATAR_CANCELLED);
export const uploadUserAvatar_Epic = action$ => (action$.ofType(UPLOAD_USER_AVATAR)
    .mergeMap(action => {
    let body = new FormData();
    body.append("file", action.payload);
    return ajax({
        method: "POST",
        url: `${config().api.user}/uploadImage`,
        body: body,
        headers: {
            "x-access-token": Store.getState().authReducer.token
        }
    });
})
    .map(json => uploadUserAvatarSuccess(json.response))
    .takeUntil(action$.ofType(UPLOAD_USER_AVATAR_CANCELLED))
    .catch(error => Rx.Observable.of(uploadUserAvatarFailure(error.xhr.response))));
export const SUGGEST_USER = "SUGGEST_USER";
export const SUGGEST_USER_FAILURE = "SUGGEST_USER_FAILURE";
export const SUGGEST_USER_SUCCESS = "SUGGEST_USER_SUCCESS";
export const SUGGEST_USER_CANCELLED = "SUGGEST_USER_CANCELLED";
export const suggestUser = createAction(SUGGEST_USER, (username, team_id) => ({ username, team_id }));
export const suggestUserSuccess = createAction(SUGGEST_USER_SUCCESS, result => result.result);
export const suggestUserFailure = createAction(SUGGEST_USER_FAILURE, error => error);
export const suggestUserCancelled = createAction(SUGGEST_USER_CANCELLED);
export const suggestUser_Epic = action$ => action$.ofType(SUGGEST_USER)
    .mergeMap(action => UserService.suggestUser(action.payload.username, action.payload.team_id)
    .map(response => suggestUserSuccess(response.xhr.response))
    .takeUntil(action$.ofType(SUGGEST_USER_CANCELLED))
    .catch(error => Rx.Observable.of(suggestUserFailure(error.xhr.response))));
export const USERRX_EMPTY_STATE = "USERRX_EMPTY_STATE";
export const emptyState = createAction(USERRX_EMPTY_STATE);
