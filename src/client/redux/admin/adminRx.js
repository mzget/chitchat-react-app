"use strict";
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs");
const { ajax } = Rx.Observable;
const configureStore_1 = require("../configureStore");
const config_1 = require("../../configs/config");
const CREATE_NEW_ORG_CHART = "CREATE_NEW_ORG_CHART";
const CREATE_NEW_ORG_CHART_SUCCESS = "CREATE_NEW_ORG_CHART_SUCCESS";
const CREATE_NEW_ORG_CHART_FAILURE = "CREATE_NEW_ORG_CHART_FAILURE";
const CREATE_NEW_ORG_CHART_CANCELLED = "CREATE_NEW_ORG_CHART_CANCELLED";
exports.createNewOrgChart = redux_actions_1.createAction(CREATE_NEW_ORG_CHART, payload => payload);
exports.createNewOrgChartSuccess = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_SUCCESS, payload => payload);
exports.createNewOrgChartFailure = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_FAILURE, error => error);
exports.createNewOrgChartCancelled = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_CANCELLED);
exports.createNewOrgChartEpic = action$ => action$.ofType(CREATE_NEW_ORG_CHART)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.user}/?username=${action.payload}`, { 'x-access-token': configureStore_1.default.getState().authReducer.token })
    .map(exports.createNewOrgChartSuccess)
    .takeUntil(action$.ofType(CREATE_NEW_ORG_CHART_CANCELLED))
    .catch(error => Rx.Observable.of(exports.createNewOrgChartFailure(error.xhr.response))));
