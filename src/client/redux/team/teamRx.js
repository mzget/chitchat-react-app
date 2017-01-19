"use strict";
const config_1 = require("../../configs/config");
const immutable_1 = require("immutable");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
const FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
const FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
const FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
exports.fetchUserTeams = (params) => ({ type: FETCH_USER_TEAMS, payload: params });
exports.fetchUserTeamsSuccess = (payload) => ({ type: FETCH_USER_TEAMS_SUCCESS, payload });
exports.fetchUserTeamsFailure = (error) => ({ type: FETCH_USER_TEAMS_FAILURE, payload: error });
exports.fetchUserTeamsCancelled = () => ({ type: FETCH_USER_TEAMS_CANCELLED });
exports.fetchUserTeamsEpic = action$ => action$.ofType(FETCH_USER_TEAMS)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/teams?user_id=${action.payload}`)
    .map(response => exports.fetchUserTeamsSuccess(response.xhr.response))
    .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
    .catch(error => Rx.Observable.of(exports.fetchUserTeamsFailure(error.xhr.response))));
exports.TeamInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    team: null
});
exports.teamReducer = (state = new exports.TeamInitState(), action) => {
    switch (action.type) {
        default:
            return state;
    }
};
