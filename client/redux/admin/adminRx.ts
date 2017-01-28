import { createAction } from "redux-actions";
import * as Rx from "rxjs";
const {ajax } = Rx.Observable;

import Store from "../configureStore";

import config from "../../configs/config";


const CREATE_NEW_ORG_CHART = "CREATE_NEW_ORG_CHART";
const CREATE_NEW_ORG_CHART_SUCCESS = "CREATE_NEW_ORG_CHART_SUCCESS";
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
            url: `${config.api.orgChart}/create`,
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
        .mergeMap(action => ajax.getJSON(`${config.api.orgChart}/team/${action.payload}`, {
            "x-access-token": Store.getState().authReducer.token
        }).map(json => getOrgChartSuccess(json))
            .takeUntil(action$.ofType(GET_ORG_CHART_CANCELLED))
            .catch(error => Rx.Observable.of(getOrgChartFailure(error.xhr.response)))
        );