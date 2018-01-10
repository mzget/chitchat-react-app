import { ChitChatFactory } from "../../chitchat/chats/ChitChatFactory";
import { Record } from "immutable";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import Store from "../configureStore";
import * as userRx from "../user/userRx";
const getConfig = () => ChitChatFactory.getInstance().config;
const FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
const FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
const FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
const FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
export const fetchUserTeams = (params) => ({ type: FETCH_USER_TEAMS, payload: params });
export const fetchUserTeamsSuccess = (payload) => ({ type: FETCH_USER_TEAMS_SUCCESS, payload });
export const fetchUserTeamsFailure = (error) => ({ type: FETCH_USER_TEAMS_FAILURE, payload: error });
export const fetchUserTeamsCancelled = () => ({ type: FETCH_USER_TEAMS_CANCELLED });
export const fetchUserTeamsEpic = action$ => action$.ofType(FETCH_USER_TEAMS)
    .mergeMap(action => ajax.getJSON(`${getConfig().api.user}/teams?user_id=${action.payload}`, { "x-access-token": Store.getState().authReducer.token })
    .map(fetchUserTeamsSuccess)
    .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
    .catch(error => Rx.Observable.of(fetchUserTeamsFailure(error.xhr.response))));
/**
 * Create team...
 */
const CREATE_TEAM = "CREATE_TEAM";
const CREATE_TEAM_SUCCESS = "CREATE_TEAM_SUCCESS";
export const CREATE_TEAM_FAILURE = "CREATE_TEAM_FAILURE";
const CREATE_TEAM_CANCELLED = "CREATE_TEAM_CANCELLED";
export const createNewTeam = (params) => ({ type: CREATE_TEAM, payload: params });
export const createNewTeamSuccess = (payload) => ({ type: CREATE_TEAM_SUCCESS, payload });
export const createNewTeamFailure = (error) => ({ type: CREATE_TEAM_FAILURE, payload: error });
export const createNewTeamCancelled = () => ({ type: CREATE_TEAM_CANCELLED });
export const createNewTeamEpic = action$ => action$.ofType(CREATE_TEAM)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${getConfig().api.team}/create`,
    body: JSON.stringify({ team_name: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
})
    .map(response => createNewTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(CREATE_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(createNewTeamFailure(error.xhr.response))));
const FIND_TEAM = "FIND_TEAM";
const FIND_TEAM_SUCCESS = "FIND_TEAM_SUCCESS";
const FIND_TEAM_FAILURE = "FIND_TEAM_FAILURE";
const FIND_TEAM_CANCELLED = "FIND_TEAM_CANCELLED";
export const findTeam = createAction(FIND_TEAM, team_name => team_name);
const findTeamSuccess = createAction(FIND_TEAM_SUCCESS, payload => payload);
const findTeamFailure = createAction(FIND_TEAM_FAILURE, error => error);
const findTeamCancelled = createAction(FIND_TEAM_CANCELLED);
export const findTeamEpic = action$ => action$.ofType(FIND_TEAM)
    .mergeMap(action => ajax({
    method: "GET",
    url: `${getConfig().api.team}?name=${action.payload}`,
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
}).map(response => findTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(FIND_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(findTeamFailure(error.xhr.response))));
const JOIN_TEAM = "JOIN_TEAM";
const JOIN_TEAM_SUCCESS = "JOIN_TEAM_SUCCESS";
export const JOIN_TEAM_FAILURE = "JOIN_TEAM_FAILURE";
const JOIN_TEAM_CANCELLED = "JOIN_TEAM_CANCELLED";
export const joinTeam = createAction(JOIN_TEAM, team_name => team_name);
const joinTeamSuccess = createAction(JOIN_TEAM_SUCCESS, payload => payload);
const joinTeamFailure = createAction(JOIN_TEAM_FAILURE, payload => payload);
const joinTeamCancelled = createAction(JOIN_TEAM_CANCELLED);
export const joinTeamEpic = action$ => action$.ofType(JOIN_TEAM)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${getConfig().api.team}/join`,
    body: JSON.stringify({ name: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
})
    .map(response => joinTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(JOIN_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(joinTeamFailure(error.xhr.response)))
    .do((x) => {
    if (x.type === JOIN_TEAM_SUCCESS)
        Store.dispatch(userRx.fetchUser(Store.getState().authReducer.user));
}));
const GET_TEAMS_INFO = "GET_TEAMS_INFO";
const GET_TEAMS_INFO_SUCCESS = "GET_TEAMS_INFO_SUCCESS";
export const GET_TEAMS_INFO_FAILURE = "GET_TEAMS_INFO_FAILURE";
const GET_TEAMS_INFO_CANCELLED = "GET_TEAMS_INFO_CANCELLED";
export const getTeamsInfo = (params) => ({ type: GET_TEAMS_INFO, payload: params });
export const getTeamsInfoSuccess = (payload) => ({ type: GET_TEAMS_INFO_SUCCESS, payload });
export const getTeamsInfoFailure = (error) => ({ type: GET_TEAMS_INFO_FAILURE, payload: error });
export const getTeamsInfoCancelled = () => ({ type: GET_TEAMS_INFO_CANCELLED });
export const getTeamsInfoEpic = action$ => action$.ofType(GET_TEAMS_INFO).mergeMap(action => ajax({
    method: "POST",
    url: `${getConfig().api.team}/teamsInfo`,
    body: JSON.stringify({ team_ids: action.payload }),
    headers: {
        "Content-Type": "application/json", "x-access-token": Store.getState().authReducer.token
    }
}).map(response => getTeamsInfoSuccess(response.xhr.response))
    .takeUntil(action$.ofType(GET_TEAMS_INFO_CANCELLED))
    .catch(error => Rx.Observable.of(getTeamsInfoFailure(error.xhr.response))));
const GET_TEAM_MEMBERS = "GET_TEAM_MEMBERS";
const GET_TEAM_MEMBERS_SUCCESS = "GET_TEAM_MEMBERS_SUCCESS";
const GET_TEAM_MEMBERS_FAILURE = "GET_TEAM_MEMBERS_FAILURE";
const GET_TEAM_MEMBERS_CANCELLED = "GET_TEAM_MEMBERS_CANCELLED";
export function getTeamMembers(team_id) {
    return { type: GET_TEAM_MEMBERS, payload: team_id };
}
function getTeamMembersSuccess(payload) {
    return { type: GET_TEAM_MEMBERS_SUCCESS, payload };
}
function getTeamMembersFailure(payload) {
    return { type: GET_TEAM_MEMBERS_FAILURE, payload };
}
function getTeamMembersCancelled() {
    return { type: GET_TEAM_MEMBERS_CANCELLED };
}
export function getTeamMembersEpic(action$) {
    return action$.ofType(GET_TEAM_MEMBERS)
        .mergeMap(action => ajax({
        method: "GET",
        url: `${getConfig().api.team}/teamMembers/?id=${action.payload}`,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": Store.getState().authReducer.token
        }
    }).map((x) => {
        let res = x.response;
        let results = res.result;
        let user_id = Store.getState().userReducer.user._id;
        let members = new Array();
        Rx.Observable.from(results)
            .filter((x, i) => x._id !== user_id)
            .subscribe(x => members.push(x));
        return members;
    }).map(members => getTeamMembersSuccess(members))
        .takeUntil(action$.ofType(GET_TEAM_MEMBERS_CANCELLED))
        .catch(error => Rx.Observable.of(getTeamMembersFailure(error.xhr.response)))
        .do(x => {
        if (x.type === GET_TEAM_MEMBERS_SUCCESS) {
            let arr = x.payload;
        }
    }));
}
export const TEAM_SELECTED = "TEAM_SELECTED";
export const selectTeam = (team) => ({ type: TEAM_SELECTED, payload: team });
const TEAM_REDUCER_CLEAR_ERROR = "TEAM_REDUCER_CLEAR_ERROR";
export const clearError = createAction(TEAM_REDUCER_CLEAR_ERROR);
export const TeamInitState = Record({
    isFetching: false,
    state: null,
    teams: new Array(),
    team: null,
    members: null,
    findingTeams: null
});
export const teamReducer = (state = new TeamInitState(), action) => {
    switch (action.type) {
        case CREATE_TEAM_SUCCESS: {
            let teams = state.get("teams");
            let newItems = teams.concat(action.payload.result);
            return state.set("teams", newItems);
        }
        case FIND_TEAM: {
            return state.set("isFetching", true);
        }
        case FIND_TEAM_SUCCESS: {
            return state.set("findingTeams", action.payload.result)
                .set("isFetching", false);
        }
        case FIND_TEAM_FAILURE: {
            return state.set("findingTeams", null)
                .set("isFetching", false);
        }
        case JOIN_TEAM: {
            return state.set("isFetching", true);
        }
        case JOIN_TEAM_SUCCESS: {
            return state.set("isFetching", false).set("findingTeams", null);
        }
        case JOIN_TEAM_FAILURE: {
            return state.set("isFetching", false);
        }
        case FETCH_USER_TEAMS_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case GET_TEAMS_INFO_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case TEAM_SELECTED: {
            return state.set("team", action.payload)
                .set("teams", null);
        }
        case GET_TEAM_MEMBERS_SUCCESS: {
            return state.set("members", action.payload);
        }
        case TEAM_REDUCER_CLEAR_ERROR: {
            return state.set("state", null)
                .set("error", null);
        }
        default:
            return state;
    }
};
