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
export const createNewOrgChartSuccess = createAction(CREATE_NEW_ORG_CHART_SUCCESS, payload => payload);
export const createNewOrgChartFailure = createAction(CREATE_NEW_ORG_CHART_FAILURE, error => error);
export const createNewOrgChartCancelled = createAction(CREATE_NEW_ORG_CHART_CANCELLED);
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

