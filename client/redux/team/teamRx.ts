import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from 'rxjs/Rx';
const { ajax } = Rx.Observable;

import Store from '../configureStore';


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
        .mergeMap(action => ajax.getJSON(`${config.api.user}/teams?user_id=${action.payload}`,
            { "x-access-token": Store.getState().authReducer.token })
            .map(fetchUserTeamsSuccess)
            .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))
            .catch(error => Rx.Observable.of(fetchUserTeamsFailure(error.xhr.response)))
        );



const CREATE_TEAM = "CREATE_TEAM";
const CREATE_TEAM_SUCCESS = "CREATE_TEAM_SUCCESS";
const CREATE_TEAM_FAILURE = "CREATE_TEAM_FAILURE";
const CREATE_TEAM_CANCELLED = "CREATE_TEAM_CANCELLED";
export const createNewTeam = (params) => ({ type: CREATE_TEAM, payload: params })
export const createNewTeamSuccess = (payload) => ({ type: CREATE_TEAM_SUCCESS, payload })
export const createNewTeamFailure = (error) => ({ type: CREATE_TEAM_FAILURE, payload: error })
export const createNewTeamCancelled = () => ({ type: CREATE_TEAM_CANCELLED })
export const createNewTeamEpic = action$ =>
    action$.ofType(CREATE_TEAM)
        .mergeMap(action => ajax({
            method: 'POST',
            url: `${config.api.team}/create`,
            body: JSON.stringify({ team_name: action.payload }),
            headers: {
                'Content-Type': 'application/json', 'x-access-token': Store.getState().authReducer.token
            }
        })
            .map(response => createNewTeamSuccess(response.xhr.response))
            .takeUntil(action$.ofType(CREATE_TEAM_CANCELLED))
            .catch(error => Rx.Observable.of(createNewTeamFailure(error.xhr.response)))
        );

const GET_TEAMS_INFO = "GET_TEAMS_INFO";
const GET_TEAMS_INFO_SUCCESS = "GET_TEAMS_INFO_SUCCESS";
const GET_TEAMS_INFO_FAILURE = "GET_TEAMS_INFO_FAILURE";
const GET_TEAMS_INFO_CANCELLED = "GET_TEAMS_INFO_CANCELLED";
export const getTeamsInfo = (params) => ({ type: GET_TEAMS_INFO, payload: params })
export const getTeamsInfoSuccess = (payload) => ({ type: GET_TEAMS_INFO_SUCCESS, payload })
export const getTeamsInfoFailure = (error) => ({ type: GET_TEAMS_INFO_FAILURE, payload: error })
export const getTeamsInfoCancelled = () => ({ type: GET_TEAMS_INFO_CANCELLED })
export const getTeamsInfoEpic = action$ =>
    action$.ofType(GET_TEAMS_INFO).mergeMap(action => ajax({
        method: 'POST',
        url: `${config.api.team}/teamsInfo`,
        body: JSON.stringify({ team_ids: action.payload }),
        headers: {
            'Content-Type': 'application/json', 'x-access-token': Store.getState().authReducer.token
        }
    }).map(response => getTeamsInfoSuccess(response.xhr.response))
        .takeUntil(action$.ofType(GET_TEAMS_INFO_CANCELLED))
        .catch(error => Rx.Observable.of(getTeamsInfoFailure(error.xhr.response)))
    );

const TEAM_SELECTED = "TEAM_SELECTED";
export const selectTeam = (team) => ({ type: TEAM_SELECTED, payload: team });

export const TeamInitState = Record({
    isFetching: false,
    state: null,
    teams: null,
    team: null
});
export const teamReducer = (state = new TeamInitState(), action) => {
    switch (action.type) {
        case CREATE_TEAM_SUCCESS: {
            return state.set('teams', action.payload.result);
        }

        case FETCH_USER_TEAMS_SUCCESS: {
            return state.set('teams', action.payload.result)
        }

        case GET_TEAMS_INFO_SUCCESS: {
            return state.set('teams', action.payload.result)
        }

        case TEAM_SELECTED: {
            return state.set("team", action.payload)
                .set("teams", null);
        }
        default:
            return state;
    }
};