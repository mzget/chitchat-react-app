import { createAction } from "redux-actions";
import * as Rx from "rxjs";
const { ajax } = Rx.Observable;

import Store from "../configureStore";
import {ChitchatFactory} from "../../chitchat/chats/chitchatFactory";
const config = () => ChitchatFactory.getInstance().config;

import * as UserService from "../../chitchat/chats/services/UserService";


const CREATE_NEW_ORG_CHART = "CREATE_NEW_ORG_CHART";
export const CREATE_NEW_ORG_CHART_SUCCESS = "CREATE_NEW_ORG_CHART_SUCCESS";
const CREATE_NEW_ORG_CHART_FAILURE = "CREATE_NEW_ORG_CHART_FAILURE";
const CREATE_NEW_ORG_CHART_CANCELLED = "CREATE_NEW_ORG_CHART_CANCELLED";
export const createNewOrgChart = createAction(CREATE_NEW_ORG_CHART, payload => payload);
const createNewOrgChartSuccess = createAction(CREATE_NEW_ORG_CHART_SUCCESS, payload => payload);
const createNewOrgChartFailure = createAction(CREATE_NEW_ORG_CHART_FAILURE, error => error);
const createNewOrgChartCancelled = createAction(CREATE_NEW_ORG_CHART_CANCELLED);
export const createNewOrgChartEpic = action$ =>
    action$.ofType(CREATE_NEW_ORG_CHART)
        .mergeMap(action => ajax({
            method: "POST",
            url: `${config().api.orgChart}/create`,
            body: JSON.stringify({ chart: action.payload }),
            headers: {
                "Content-Type": "application/json",
                "x-access-token": Store.getState().authReducer.token
            }
        }).map(result => createNewOrgChartSuccess(result.response.result))
            .takeUntil(action$.ofType(CREATE_NEW_ORG_CHART_CANCELLED))
            .catch(error => Rx.Observable.of(createNewOrgChartFailure(error.xhr.response)))
        );

const GET_ORG_CHART = "GET_ORG_CHART";
export const GET_ORG_CHART_SUCCESS = "GET_ORG_CHART_SUCCESS";
export const GET_ORG_CHART_FAILURE = "GET_ORG_CHART_FAILURE";
const GET_ORG_CHART_CANCELLED = "GET_ORG_CHART_CANCELLED";
export const getOrgChart = createAction(GET_ORG_CHART, team_id => team_id);
const getOrgChartSuccess = createAction(GET_ORG_CHART_SUCCESS, payload => payload);
const getOrgChartFailure = createAction(GET_ORG_CHART_FAILURE, error => error);
const getOrgChartCancelled = createAction(GET_ORG_CHART_CANCELLED);
export const getOrgChartEpic = action$ =>
    action$.ofType(GET_ORG_CHART)
        .mergeMap(action => ajax.getJSON(`${config().api.orgChart}/team/${action.payload}`, {
            "x-access-token": Store.getState().authReducer.token
        }).map(json => getOrgChartSuccess(json))
            .takeUntil(action$.ofType(GET_ORG_CHART_CANCELLED))
            .catch(error => Rx.Observable.of(getOrgChartFailure(error.xhr.response)))
        );

const UPDATE_USER_ORG_CHART = "UPDATE_USER_ORG_CHART";
export const UPDATE_USER_ORG_CHART_SUCCESS = "UPDATE_USER_ORG_CHART_SUCCESS";
export const UPDATE_USER_ORG_CHART_FAILURE = "UPDATE_USER_ORG_CHART_FAILURE";
const UPDATE_USER_ORG_CHART_CANCELLED = "UPDATE_USER_ORG_CHART_CANCELLED";
export const updateUserOrgChart = (user, team_id, orgChart_id) => ({
    type: UPDATE_USER_ORG_CHART,
    payload: { user: user, team_id: team_id, orgChart_id: orgChart_id }
});
const updateUserOrgChartSuccess = createAction(UPDATE_USER_ORG_CHART_SUCCESS, payload => payload);
const updateUserOrgChartFailure = createAction(UPDATE_USER_ORG_CHART_FAILURE, error => error);
export const updateUserOrgChartCancelled = createAction(UPDATE_USER_ORG_CHART_CANCELLED);
export const updateUserOrgChartEpic = action$ =>
    action$.ofType(UPDATE_USER_ORG_CHART)
        .mergeMap(action => {
            let token = Store.getState().authReducer.token;
            return UserService.setOrgChartId(token, action.payload.user, action.payload.team_id, action.payload.orgChart_id)
        })
        .map((result: Rx.AjaxResponse) => updateUserOrgChartSuccess(result.response.result))
        .takeUntil(action$.ofType(UPDATE_USER_ORG_CHART_CANCELLED))
        .catch((error: Rx.AjaxResponse) => Rx.Observable.of(updateUserOrgChartFailure(error.xhr.response)));


export const ADMIN_RX_EMPTY_STATE = "ADMIN_RX_EMPTY_STATE";
export const emptyState = () => ({ type: ADMIN_RX_EMPTY_STATE });