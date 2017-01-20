"use strict";
const config_1 = require("../../configs/config");
const immutable_1 = require("immutable");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const configureStore_1 = require("../configureStore");
const FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
const FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
const FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
const FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
exports.fetchUserTeams = (params) => ({ type: FETCH_USER_TEAMS, payload: params });
exports.fetchUserTeamsSuccess = (payload) => ({ type: FETCH_USER_TEAMS_SUCCESS, payload });
exports.fetchUserTeamsFailure = (error) => ({ type: FETCH_USER_TEAMS_FAILURE, payload: error });
exports.fetchUserTeamsCancelled = () => ({ type: FETCH_USER_TEAMS_CANCELLED });
exports.fetchUserTeamsEpic = action$ => action$.ofType(FETCH_USER_TEAMS)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/teams?user_id=${action.payload}`, { "x-access-token": configureStore_1.default.getState().authReducer.token })
    .map(exports.fetchUserTeamsSuccess)
    .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
    .catch(error => Rx.Observable.of(exports.fetchUserTeamsFailure(error.xhr.response))));
const CREATE_TEAM = "CREATE_TEAM";
const CREATE_TEAM_SUCCESS = "CREATE_TEAM_SUCCESS";
const CREATE_TEAM_FAILURE = "CREATE_TEAM_FAILURE";
const CREATE_TEAM_CANCELLED = "CREATE_TEAM_CANCELLED";
exports.createNewTeam = (params) => ({ type: CREATE_TEAM, payload: params });
exports.createNewTeamSuccess = (payload) => ({ type: CREATE_TEAM_SUCCESS, payload });
exports.createNewTeamFailure = (error) => ({ type: CREATE_TEAM_FAILURE, payload: error });
exports.createNewTeamCancelled = () => ({ type: CREATE_TEAM_CANCELLED });
exports.createNewTeamEpic = action$ => action$.ofType(CREATE_TEAM)
    .mergeMap(action => ajax({
    method: 'POST',
    url: `${config_1.default.api.team}/create`,
    body: JSON.stringify({ team_name: action.payload }),
    headers: {
        'Content-Type': 'application/json', 'x-access-token': configureStore_1.default.getState().authReducer.token
    }
})
    .map(response => exports.createNewTeamSuccess(response.xhr.response))
    .takeUntil(action$.ofType(CREATE_TEAM_CANCELLED))
    .catch(error => Rx.Observable.of(exports.createNewTeamFailure(error.xhr.response))));
const GET_TEAMS_INFO = "GET_TEAMS_INFO";
const GET_TEAMS_INFO_SUCCESS = "GET_TEAMS_INFO_SUCCESS";
const GET_TEAMS_INFO_FAILURE = "GET_TEAMS_INFO_FAILURE";
const GET_TEAMS_INFO_CANCELLED = "GET_TEAMS_INFO_CANCELLED";
exports.getTeamsInfo = (params) => ({ type: GET_TEAMS_INFO, payload: params });
exports.getTeamsInfoSuccess = (payload) => ({ type: GET_TEAMS_INFO_SUCCESS, payload });
exports.getTeamsInfoFailure = (error) => ({ type: GET_TEAMS_INFO_FAILURE, payload: error });
exports.getTeamsInfoCancelled = () => ({ type: GET_TEAMS_INFO_CANCELLED });
exports.getTeamsInfoEpic = action$ => action$.ofType(GET_TEAMS_INFO).mergeMap(action => ajax({
    method: 'POST',
    url: `${config_1.default.api.team}/teamsInfo`,
    body: JSON.stringify({ team_ids: action.payload }),
    headers: {
        'Content-Type': 'application/json', 'x-access-token': configureStore_1.default.getState().authReducer.token
    }
}).map(response => exports.getTeamsInfoSuccess(response.xhr.response))
    .takeUntil(action$.ofType(GET_TEAMS_INFO_CANCELLED))
    .catch(error => Rx.Observable.of(exports.getTeamsInfoFailure(error.xhr.response))));
exports.TeamInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    teams: null
});
exports.teamReducer = (state = new exports.TeamInitState(), action) => {
    switch (action.type) {
        case CREATE_TEAM_SUCCESS: {
            return state.set('teams', action.payload.result);
        }
        case FETCH_USER_TEAMS_SUCCESS: {
            return state.set('teams', action.payload.result);
        }
        case GET_TEAMS_INFO_SUCCESS: {
            return state.set('teams', action.payload.result);
        }
        default:
            return state;
    }
};
