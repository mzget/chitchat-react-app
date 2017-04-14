"use strict";
const chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
const immutable_1 = require("immutable");
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const configureStore_1 = require("../configureStore");
const userRx = require("../user/userRx");
const config = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
const FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
const FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
const FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
exports.fetchUserTeams = (params) => ({ type: FETCH_USER_TEAMS, payload: params });
exports.fetchUserTeamsSuccess = (payload) => ({ type: FETCH_USER_TEAMS_SUCCESS, payload });
exports.fetchUserTeamsFailure = (error) => ({ type: FETCH_USER_TEAMS_FAILURE, payload: error });
exports.fetchUserTeamsCancelled = () => ({ type: FETCH_USER_TEAMS_CANCELLED });
exports.fetchUserTeamsEpic = action$ => action$.ofType(FETCH_USER_TEAMS)
    .mergeMap(action => ajax.getJSON(`${config().api.user}/teams?user_id=${action.payload}`, { "x-access-token": configureStore_1.default.getState().authReducer.token })
    .map(exports.fetchUserTeamsSuccess)
    .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
    .catch(error => Rx.Observable.of(exports.fetchUserTeamsFailure(error.xhr.response))));
/**
 * Create team...
 */
const CREATE_TEAM = "CREATE_TEAM";
const CREATE_TEAM_SUCCESS = "CREATE_TEAM_SUCCESS";
exports.CREATE_TEAM_FAILURE = "CREATE_TEAM_FAILURE";
const CREATE_TEAM_CANCELLED = "CREATE_TEAM_CANCELLED";
exports.createNewTeam = (params) => ({ type: CREATE_TEAM, payload: params });
exports.createNewTeamSuccess = (payload) => ({ type: CREATE_TEAM_SUCCESS, payload });
exports.createNewTeamFailure = (error) => ({ type: exports.CREATE_TEAM_FAILURE, payload: error });
exports.createNewTeamCancelled = () => ({ type: CREATE_TEAM_CANCELLED });
exports.createNewTeamEpic = action$ => action$.ofType(CREATE_TEAM)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.team}/create`,
    body: JSON.stringify({ team_name: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
})
    .map(response => exports.createNewTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(CREATE_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(exports.createNewTeamFailure(error.xhr.response))));
const FIND_TEAM = "FIND_TEAM";
const FIND_TEAM_SUCCESS = "FIND_TEAM_SUCCESS";
const FIND_TEAM_FAILURE = "FIND_TEAM_FAILURE";
const FIND_TEAM_CANCELLED = "FIND_TEAM_CANCELLED";
exports.findTeam = redux_actions_1.createAction(FIND_TEAM, team_name => team_name);
const findTeamSuccess = redux_actions_1.createAction(FIND_TEAM_SUCCESS, payload => payload);
const findTeamFailure = redux_actions_1.createAction(FIND_TEAM_FAILURE, error => error);
const findTeamCancelled = redux_actions_1.createAction(FIND_TEAM_CANCELLED);
exports.findTeamEpic = action$ => action$.ofType(FIND_TEAM)
    .mergeMap(action => ajax({
    method: "GET",
    url: `${config().api.team}?name=${action.payload}`,
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
}).map(response => findTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(FIND_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(findTeamFailure(error.xhr.response))));
const JOIN_TEAM = "JOIN_TEAM";
const JOIN_TEAM_SUCCESS = "JOIN_TEAM_SUCCESS";
const JOIN_TEAM_FAILURE = "JOIN_TEAM_FAILURE";
const JOIN_TEAM_CANCELLED = "JOIN_TEAM_CANCELLED";
exports.joinTeam = redux_actions_1.createAction(JOIN_TEAM, team_name => team_name);
const joinTeamSuccess = redux_actions_1.createAction(JOIN_TEAM_SUCCESS, payload => payload);
const joinTeamFailure = redux_actions_1.createAction(JOIN_TEAM_FAILURE, payload => payload);
const joinTeamCancelled = redux_actions_1.createAction(JOIN_TEAM_CANCELLED);
exports.joinTeamEpic = action$ => action$.ofType(JOIN_TEAM)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.team}/join`,
    body: JSON.stringify({ name: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
})
    .map(response => joinTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(JOIN_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(joinTeamFailure(error.xhr.response)))
    .do((x) => {
    if (x.type === JOIN_TEAM_SUCCESS)
        configureStore_1.default.dispatch(userRx.fetchUser(configureStore_1.default.getState().userReducer.user.username));
}));
const GET_TEAMS_INFO = "GET_TEAMS_INFO";
const GET_TEAMS_INFO_SUCCESS = "GET_TEAMS_INFO_SUCCESS";
const GET_TEAMS_INFO_FAILURE = "GET_TEAMS_INFO_FAILURE";
const GET_TEAMS_INFO_CANCELLED = "GET_TEAMS_INFO_CANCELLED";
exports.getTeamsInfo = (params) => ({ type: GET_TEAMS_INFO, payload: params });
exports.getTeamsInfoSuccess = (payload) => ({ type: GET_TEAMS_INFO_SUCCESS, payload });
exports.getTeamsInfoFailure = (error) => ({ type: GET_TEAMS_INFO_FAILURE, payload: error });
exports.getTeamsInfoCancelled = () => ({ type: GET_TEAMS_INFO_CANCELLED });
exports.getTeamsInfoEpic = action$ => action$.ofType(GET_TEAMS_INFO).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.team}/teamsInfo`,
    body: JSON.stringify({ team_ids: action.payload }),
    headers: {
        "Content-Type": "application/json", "x-access-token": configureStore_1.default.getState().authReducer.token
    }
}).map(response => exports.getTeamsInfoSuccess(response.xhr.response))
    .takeUntil(action$.ofType(GET_TEAMS_INFO_CANCELLED))
    .catch(error => Rx.Observable.of(exports.getTeamsInfoFailure(error.xhr.response))));
const GET_TEAM_MEMBERS = "GET_TEAM_MEMBERS";
const GET_TEAM_MEMBERS_SUCCESS = "GET_TEAM_MEMBERS_SUCCESS";
const GET_TEAM_MEMBERS_FAILURE = "GET_TEAM_MEMBERS_FAILURE";
const GET_TEAM_MEMBERS_CANCELLED = "GET_TEAM_MEMBERS_CANCELLED";
function getTeamMembers(team_id) {
    return { type: GET_TEAM_MEMBERS, payload: team_id };
}
exports.getTeamMembers = getTeamMembers;
function getTeamMembersSuccess(payload) {
    return { type: GET_TEAM_MEMBERS_SUCCESS, payload };
}
function getTeamMembersFailure(payload) {
    return { type: GET_TEAM_MEMBERS_FAILURE, payload };
}
function getTeamMembersCancelled() {
    return { type: GET_TEAM_MEMBERS_CANCELLED };
}
function getTeamMembersEpic(action$) {
    return action$.ofType(GET_TEAM_MEMBERS)
        .mergeMap(action => ajax({
        method: "GET",
        url: `${config().api.team}/teamMembers/?id=${action.payload}`,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1.default.getState().authReducer.token
        }
    }).map((x) => {
        let res = x.response;
        let results = res.result;
        let user_id = configureStore_1.default.getState().userReducer.user._id;
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
exports.getTeamMembersEpic = getTeamMembersEpic;
exports.TEAM_SELECTED = "TEAM_SELECTED";
exports.selectTeam = (team) => ({ type: exports.TEAM_SELECTED, payload: team });
const TEAM_REDUCER_CLEAR_ERROR = "TEAM_REDUCER_CLEAR_ERROR";
exports.clearError = redux_actions_1.createAction(TEAM_REDUCER_CLEAR_ERROR);
exports.TeamInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    teams: new Array(),
    team: null,
    members: null,
    findingTeams: null,
    error: null
});
exports.teamReducer = (state = new exports.TeamInitState(), action) => {
    switch (action.type) {
        case CREATE_TEAM_SUCCESS: {
            let teams = state.get("teams");
            let newItems = teams.concat(action.payload.result);
            return state.set("teams", newItems);
        }
        case exports.CREATE_TEAM_FAILURE: {
            return state.set("state", exports.CREATE_TEAM_FAILURE)
                .set("error", action.payload.message);
        }
        case FIND_TEAM_SUCCESS: {
            return state.set("findingTeams", action.payload.result);
        }
        case FIND_TEAM_FAILURE: {
            return state.set("findingTeams", null);
        }
        case FETCH_USER_TEAMS_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case GET_TEAMS_INFO_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case GET_TEAMS_INFO_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case exports.TEAM_SELECTED: {
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
