import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from 'rxjs/Rx';
const { ajax } = Rx.Observable;


const FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
const FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
const FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
const FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
export const fetchUserTeams = (params) => ({ type: FETCH_USER_TEAMS, payload: params })
export const fetchUserTeamsSuccess = (payload) => ({ type: FETCH_USER_TEAMS_SUCCESS, payload })
export const fetchUserTeamsFailure = (error) => ({ type: FETCH_USER_TEAMS_FAILURE, payload: error })
export const fetchUserTeamsCancelled = () => ({ type: FETCH_USER_TEAMS_CANCELLED })

export const fetchUserTeamsEpic = action$ =>
    action$.ofType(FETCH_USER_TEAMS)
        .mergeMap(action =>
            ajax.getJSON(`${config.api.user}/teams?user_id=${action.payload}`)
                .map(response => fetchUserTeamsSuccess(response.xhr.response))
                .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
                .catch(error => Rx.Observable.of(fetchUserTeamsFailure(error.xhr.response)))
        );

export const TeamInitState = Record({
    isFetching: false,
    state: null,
    team: null
});
export const teamReducer = (state = new TeamInitState(), action) => {
    switch (action.type) {

        default:
            return state;
    }
};