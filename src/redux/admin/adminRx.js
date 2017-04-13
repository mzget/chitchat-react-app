"use strict";
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs");
const { ajax } = Rx.Observable;
const configureStore_1 = require("../configureStore");
const config_1 = require("../../configs/config");
const UserService = require("../../chitchat/chats/services/UserService");
const CREATE_NEW_ORG_CHART = "CREATE_NEW_ORG_CHART";
exports.CREATE_NEW_ORG_CHART_SUCCESS = "CREATE_NEW_ORG_CHART_SUCCESS";
const CREATE_NEW_ORG_CHART_FAILURE = "CREATE_NEW_ORG_CHART_FAILURE";
const CREATE_NEW_ORG_CHART_CANCELLED = "CREATE_NEW_ORG_CHART_CANCELLED";
exports.createNewOrgChart = redux_actions_1.createAction(CREATE_NEW_ORG_CHART, payload => payload);
const createNewOrgChartSuccess = redux_actions_1.createAction(exports.CREATE_NEW_ORG_CHART_SUCCESS, payload => payload);
const createNewOrgChartFailure = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_FAILURE, error => error);
const createNewOrgChartCancelled = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_CANCELLED);
exports.createNewOrgChartEpic = action$ => action$.ofType(CREATE_NEW_ORG_CHART)
    .mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.orgChart}/create`,
    body: JSON.stringify({ chart: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
}).map(result => createNewOrgChartSuccess(result.response.result))
    .takeUntil(action$.ofType(CREATE_NEW_ORG_CHART_CANCELLED))
    .catch(error => Rx.Observable.of(createNewOrgChartFailure(error.xhr.response))));
const GET_ORG_CHART = "GET_ORG_CHART";
exports.GET_ORG_CHART_SUCCESS = "GET_ORG_CHART_SUCCESS";
exports.GET_ORG_CHART_FAILURE = "GET_ORG_CHART_FAILURE";
const GET_ORG_CHART_CANCELLED = "GET_ORG_CHART_CANCELLED";
exports.getOrgChart = redux_actions_1.createAction(GET_ORG_CHART, team_id => team_id);
const getOrgChartSuccess = redux_actions_1.createAction(exports.GET_ORG_CHART_SUCCESS, payload => payload);
const getOrgChartFailure = redux_actions_1.createAction(exports.GET_ORG_CHART_FAILURE, error => error);
const getOrgChartCancelled = redux_actions_1.createAction(GET_ORG_CHART_CANCELLED);
exports.getOrgChartEpic = action$ => action$.ofType(GET_ORG_CHART)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.orgChart}/team/${action.payload}`, {
    "x-access-token": configureStore_1.default.getState().authReducer.token
}).map(json => getOrgChartSuccess(json))
    .takeUntil(action$.ofType(GET_ORG_CHART_CANCELLED))
    .catch(error => Rx.Observable.of(getOrgChartFailure(error.xhr.response))));
const UPDATE_USER_ORG_CHART = "UPDATE_USER_ORG_CHART";
exports.UPDATE_USER_ORG_CHART_SUCCESS = "UPDATE_USER_ORG_CHART_SUCCESS";
exports.UPDATE_USER_ORG_CHART_FAILURE = "UPDATE_USER_ORG_CHART_FAILURE";
const UPDATE_USER_ORG_CHART_CANCELLED = "UPDATE_USER_ORG_CHART_CANCELLED";
exports.updateUserOrgChart = (user, team_id, orgChart_id) => ({
    type: UPDATE_USER_ORG_CHART,
    payload: { user: user, team_id: team_id, orgChart_id: orgChart_id }
});
const updateUserOrgChartSuccess = redux_actions_1.createAction(exports.UPDATE_USER_ORG_CHART_SUCCESS, payload => payload);
const updateUserOrgChartFailure = redux_actions_1.createAction(exports.UPDATE_USER_ORG_CHART_FAILURE, error => error);
exports.updateUserOrgChartCancelled = redux_actions_1.createAction(UPDATE_USER_ORG_CHART_CANCELLED);
exports.updateUserOrgChartEpic = action$ => action$.ofType(UPDATE_USER_ORG_CHART)
    .mergeMap(action => {
    let token = configureStore_1.default.getState().authReducer.token;
    return UserService.setOrgChartId(token, action.payload.user, action.payload.team_id, action.payload.orgChart_id);
})
    .map((result) => updateUserOrgChartSuccess(result.response.result))
    .takeUntil(action$.ofType(UPDATE_USER_ORG_CHART_CANCELLED))
    .catch((error) => Rx.Observable.of(updateUserOrgChartFailure(error.xhr.response)));
exports.ADMIN_RX_EMPTY_STATE = "ADMIN_RX_EMPTY_STATE";
exports.emptyState = () => ({ type: exports.ADMIN_RX_EMPTY_STATE });
