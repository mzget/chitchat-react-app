"use strict";
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs");
var ajax = Rx.Observable.ajax;
var configureStore_1 = require("../configureStore");
var chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
var config = function () { return chitchatFactory_1.ChitChatFactory.getInstance().config; };
var UserService = require("../../chitchat/chats/services/UserService");
var CREATE_NEW_ORG_CHART = "CREATE_NEW_ORG_CHART";
exports.CREATE_NEW_ORG_CHART_SUCCESS = "CREATE_NEW_ORG_CHART_SUCCESS";
var CREATE_NEW_ORG_CHART_FAILURE = "CREATE_NEW_ORG_CHART_FAILURE";
var CREATE_NEW_ORG_CHART_CANCELLED = "CREATE_NEW_ORG_CHART_CANCELLED";
exports.createNewOrgChart = redux_actions_1.createAction(CREATE_NEW_ORG_CHART, function (payload) { return payload; });
var createNewOrgChartSuccess = redux_actions_1.createAction(exports.CREATE_NEW_ORG_CHART_SUCCESS, function (payload) { return payload; });
var createNewOrgChartFailure = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_FAILURE, function (error) { return error; });
var createNewOrgChartCancelled = redux_actions_1.createAction(CREATE_NEW_ORG_CHART_CANCELLED);
exports.createNewOrgChartEpic = function (action$) {
    return action$.ofType(CREATE_NEW_ORG_CHART)
        .mergeMap(function (action) { return ajax({
        method: "POST",
        url: config().api.orgChart + "/create",
        body: JSON.stringify({ chart: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    }).map(function (result) { return createNewOrgChartSuccess(result.response.result); })
        .takeUntil(action$.ofType(CREATE_NEW_ORG_CHART_CANCELLED))["catch"](function (error) { return Rx.Observable.of(createNewOrgChartFailure(error.xhr.response)); }); });
};
var GET_ORG_CHART = "GET_ORG_CHART";
exports.GET_ORG_CHART_SUCCESS = "GET_ORG_CHART_SUCCESS";
exports.GET_ORG_CHART_FAILURE = "GET_ORG_CHART_FAILURE";
var GET_ORG_CHART_CANCELLED = "GET_ORG_CHART_CANCELLED";
exports.getOrgChart = redux_actions_1.createAction(GET_ORG_CHART, function (team_id) { return team_id; });
var getOrgChartSuccess = redux_actions_1.createAction(exports.GET_ORG_CHART_SUCCESS, function (payload) { return payload; });
var getOrgChartFailure = redux_actions_1.createAction(exports.GET_ORG_CHART_FAILURE, function (error) { return error; });
var getOrgChartCancelled = redux_actions_1.createAction(GET_ORG_CHART_CANCELLED);
exports.getOrgChartEpic = function (action$) {
    return action$.ofType(GET_ORG_CHART)
        .mergeMap(function (action) { return ajax.getJSON(config().api.orgChart + "/team/" + action.payload, {
        "x-access-token": configureStore_1["default"].getState().authReducer.token
    }).map(function (json) { return getOrgChartSuccess(json); })
        .takeUntil(action$.ofType(GET_ORG_CHART_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getOrgChartFailure(error.xhr.response)); }); });
};
var UPDATE_USER_ORG_CHART = "UPDATE_USER_ORG_CHART";
exports.UPDATE_USER_ORG_CHART_SUCCESS = "UPDATE_USER_ORG_CHART_SUCCESS";
exports.UPDATE_USER_ORG_CHART_FAILURE = "UPDATE_USER_ORG_CHART_FAILURE";
var UPDATE_USER_ORG_CHART_CANCELLED = "UPDATE_USER_ORG_CHART_CANCELLED";
exports.updateUserOrgChart = function (user, team_id, orgChart_id) { return ({
    type: UPDATE_USER_ORG_CHART,
    payload: { user: user, team_id: team_id, orgChart_id: orgChart_id }
}); };
var updateUserOrgChartSuccess = redux_actions_1.createAction(exports.UPDATE_USER_ORG_CHART_SUCCESS, function (payload) { return payload; });
var updateUserOrgChartFailure = redux_actions_1.createAction(exports.UPDATE_USER_ORG_CHART_FAILURE, function (error) { return error; });
exports.updateUserOrgChartCancelled = redux_actions_1.createAction(UPDATE_USER_ORG_CHART_CANCELLED);
exports.updateUserOrgChartEpic = function (action$) {
    return action$.ofType(UPDATE_USER_ORG_CHART)
        .mergeMap(function (action) {
        var token = configureStore_1["default"].getState().authReducer.token;
        return UserService.setOrgChartId(token, action.payload.user, action.payload.team_id, action.payload.orgChart_id);
    })
        .map(function (result) { return updateUserOrgChartSuccess(result.response.result); })
        .takeUntil(action$.ofType(UPDATE_USER_ORG_CHART_CANCELLED))["catch"](function (error) { return Rx.Observable.of(updateUserOrgChartFailure(error.xhr.response)); });
};
var UPDATE_USER_TEAM_ROLE = "UPDATE_USER_TEAM_ROLE";
exports.UPDATE_USER_TEAM_ROLE_SUCCESS = "UPDATE_USER_TEAM_ROLE_SUCCESS";
var UPDATE_USER_TEAM_ROLE_FAILURE = "UPDATE_USER_TEAM_ROLE_FAILURE";
var UPDATE_USER_TEAM_ROLE_CANCELLED = "UPDATE_USER_TEAM_ROLE_CANCELLED";
exports.updateUserTeamRole = redux_actions_1.createAction(UPDATE_USER_TEAM_ROLE, function (user_id, team_id, profile) { return ({ user_id: user_id, team_id: team_id, profile: profile }); });
var updateUserTeamRole_Success = redux_actions_1.createAction(exports.UPDATE_USER_TEAM_ROLE_SUCCESS, function (payload) { return payload; });
var updateUserTeamRole_Failure = redux_actions_1.createAction(UPDATE_USER_TEAM_ROLE_FAILURE, function (payload) { return payload; });
exports.updateUserTeamRole_Cancelled = redux_actions_1.createAction(UPDATE_USER_TEAM_ROLE_CANCELLED);
exports.updateUserTeamRole_Epic = function (action$) {
    return action$.ofType(UPDATE_USER_TEAM_ROLE)
        .mergeMap(function (action) { return UserService.updateTeamProfile(action.payload.user_id, action.payload.team_id, action.payload.profile); })
        .map(function (result) { return updateUserTeamRole_Success(result.response.result); })
        .takeUntil(action$.ofType(UPDATE_USER_TEAM_ROLE_CANCELLED))["catch"](function (error) { return Rx.Observable.of(updateUserTeamRole_Failure(error.xhr.response)); });
};
exports.ADMIN_RX_EMPTY_STATE = "ADMIN_RX_EMPTY_STATE";
exports.emptyState = function () { return ({ type: exports.ADMIN_RX_EMPTY_STATE }); };
