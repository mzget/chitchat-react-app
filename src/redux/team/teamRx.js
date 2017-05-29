"use strict";
var chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
var immutable_1 = require("immutable");
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var configureStore_1 = require("../configureStore");
var userRx = require("../user/userRx");
var getConfig = function () { return chitchatFactory_1.ChitChatFactory.getInstance().config; };
var FETCH_USER_TEAMS = "FETCH_USER_TEAMS";
var FETCH_USER_TEAMS_SUCCESS = "FETCH_USER_TEAMS_SUCCESS";
var FETCH_USER_TEAMS_FAILURE = "FETCH_USER_TEAMS_FAILURE";
var FETCH_USER_TEAMS_CANCELLED = "FETCH_USER_TEAMS_CANCELLED";
exports.fetchUserTeams = function (params) { return ({ type: FETCH_USER_TEAMS, payload: params }); };
exports.fetchUserTeamsSuccess = function (payload) { return ({ type: FETCH_USER_TEAMS_SUCCESS, payload: payload }); };
exports.fetchUserTeamsFailure = function (error) { return ({ type: FETCH_USER_TEAMS_FAILURE, payload: error }); };
exports.fetchUserTeamsCancelled = function () { return ({ type: FETCH_USER_TEAMS_CANCELLED }); };
exports.fetchUserTeamsEpic = function (action$) {
    return action$.ofType(FETCH_USER_TEAMS)
        .mergeMap(function (action) { return ajax.getJSON(getConfig().api.user + "/teams?user_id=" + action.payload, { "x-access-token": configureStore_1["default"].getState().authReducer.token })
        .map(exports.fetchUserTeamsSuccess)
        .takeUntil(action$.ofType(FETCH_USER_TEAMS_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.fetchUserTeamsFailure(error.xhr.response)); }); });
};
/**
 * Create team...
 */
var CREATE_TEAM = "CREATE_TEAM";
var CREATE_TEAM_SUCCESS = "CREATE_TEAM_SUCCESS";
exports.CREATE_TEAM_FAILURE = "CREATE_TEAM_FAILURE";
var CREATE_TEAM_CANCELLED = "CREATE_TEAM_CANCELLED";
exports.createNewTeam = function (params) { return ({ type: CREATE_TEAM, payload: params }); };
exports.createNewTeamSuccess = function (payload) { return ({ type: CREATE_TEAM_SUCCESS, payload: payload }); };
exports.createNewTeamFailure = function (error) { return ({ type: exports.CREATE_TEAM_FAILURE, payload: error }); };
exports.createNewTeamCancelled = function () { return ({ type: CREATE_TEAM_CANCELLED }); };
exports.createNewTeamEpic = function (action$) {
    return action$.ofType(CREATE_TEAM)
        .mergeMap(function (action) { return ajax({
        method: "POST",
        url: getConfig().api.team + "/create",
        body: JSON.stringify({ team_name: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    })
        .map(function (response) { return exports.createNewTeamSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(CREATE_TEAM_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.createNewTeamFailure(error.xhr.response)); }); });
};
var FIND_TEAM = "FIND_TEAM";
var FIND_TEAM_SUCCESS = "FIND_TEAM_SUCCESS";
var FIND_TEAM_FAILURE = "FIND_TEAM_FAILURE";
var FIND_TEAM_CANCELLED = "FIND_TEAM_CANCELLED";
exports.findTeam = redux_actions_1.createAction(FIND_TEAM, function (team_name) { return team_name; });
var findTeamSuccess = redux_actions_1.createAction(FIND_TEAM_SUCCESS, function (payload) { return payload; });
var findTeamFailure = redux_actions_1.createAction(FIND_TEAM_FAILURE, function (error) { return error; });
var findTeamCancelled = redux_actions_1.createAction(FIND_TEAM_CANCELLED);
exports.findTeamEpic = function (action$) { return action$.ofType(FIND_TEAM)
    .mergeMap(function (action) { return ajax({
    method: "GET",
    url: getConfig().api.team + "?name=" + action.payload,
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1["default"].getState().authReducer.token
    }
}).map(function (response) { return findTeamSuccess(response.xhr.response); })
    .takeUntil(action$.ofType(FIND_TEAM_CANCELLED))["catch"](function (error) { return Rx.Observable.of(findTeamFailure(error.xhr.response)); }); }); };
var JOIN_TEAM = "JOIN_TEAM";
var JOIN_TEAM_SUCCESS = "JOIN_TEAM_SUCCESS";
var JOIN_TEAM_FAILURE = "JOIN_TEAM_FAILURE";
var JOIN_TEAM_CANCELLED = "JOIN_TEAM_CANCELLED";
exports.joinTeam = redux_actions_1.createAction(JOIN_TEAM, function (team_name) { return team_name; });
var joinTeamSuccess = redux_actions_1.createAction(JOIN_TEAM_SUCCESS, function (payload) { return payload; });
var joinTeamFailure = redux_actions_1.createAction(JOIN_TEAM_FAILURE, function (payload) { return payload; });
var joinTeamCancelled = redux_actions_1.createAction(JOIN_TEAM_CANCELLED);
exports.joinTeamEpic = function (action$) {
    return action$.ofType(JOIN_TEAM)
        .mergeMap(function (action) { return ajax({
        method: "POST",
        url: getConfig().api.team + "/join",
        body: JSON.stringify({ name: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    })
        .map(function (response) { return joinTeamSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(JOIN_TEAM_CANCELLED))["catch"](function (error) { return Rx.Observable.of(joinTeamFailure(error.xhr.response)); })["do"](function (x) {
        if (x.type === JOIN_TEAM_SUCCESS)
            configureStore_1["default"].dispatch(userRx.fetchUser(configureStore_1["default"].getState().userReducer.user.username));
    }); });
};
var GET_TEAMS_INFO = "GET_TEAMS_INFO";
var GET_TEAMS_INFO_SUCCESS = "GET_TEAMS_INFO_SUCCESS";
var GET_TEAMS_INFO_FAILURE = "GET_TEAMS_INFO_FAILURE";
var GET_TEAMS_INFO_CANCELLED = "GET_TEAMS_INFO_CANCELLED";
exports.getTeamsInfo = function (params) { return ({ type: GET_TEAMS_INFO, payload: params }); };
exports.getTeamsInfoSuccess = function (payload) { return ({ type: GET_TEAMS_INFO_SUCCESS, payload: payload }); };
exports.getTeamsInfoFailure = function (error) { return ({ type: GET_TEAMS_INFO_FAILURE, payload: error }); };
exports.getTeamsInfoCancelled = function () { return ({ type: GET_TEAMS_INFO_CANCELLED }); };
exports.getTeamsInfoEpic = function (action$) {
    return action$.ofType(GET_TEAMS_INFO).mergeMap(function (action) { return ajax({
        method: "POST",
        url: getConfig().api.team + "/teamsInfo",
        body: JSON.stringify({ team_ids: action.payload }),
        headers: {
            "Content-Type": "application/json", "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    }).map(function (response) { return exports.getTeamsInfoSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(GET_TEAMS_INFO_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.getTeamsInfoFailure(error.xhr.response)); }); });
};
var GET_TEAM_MEMBERS = "GET_TEAM_MEMBERS";
var GET_TEAM_MEMBERS_SUCCESS = "GET_TEAM_MEMBERS_SUCCESS";
var GET_TEAM_MEMBERS_FAILURE = "GET_TEAM_MEMBERS_FAILURE";
var GET_TEAM_MEMBERS_CANCELLED = "GET_TEAM_MEMBERS_CANCELLED";
function getTeamMembers(team_id) {
    return { type: GET_TEAM_MEMBERS, payload: team_id };
}
exports.getTeamMembers = getTeamMembers;
function getTeamMembersSuccess(payload) {
    return { type: GET_TEAM_MEMBERS_SUCCESS, payload: payload };
}
function getTeamMembersFailure(payload) {
    return { type: GET_TEAM_MEMBERS_FAILURE, payload: payload };
}
function getTeamMembersCancelled() {
    return { type: GET_TEAM_MEMBERS_CANCELLED };
}
function getTeamMembersEpic(action$) {
    return action$.ofType(GET_TEAM_MEMBERS)
        .mergeMap(function (action) { return ajax({
        method: "GET",
        url: getConfig().api.team + "/teamMembers/?id=" + action.payload,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    }).map(function (x) {
        var res = x.response;
        var results = res.result;
        var user_id = configureStore_1["default"].getState().userReducer.user._id;
        var members = new Array();
        Rx.Observable.from(results)
            .filter(function (x, i) { return x._id !== user_id; })
            .subscribe(function (x) { return members.push(x); });
        return members;
    }).map(function (members) { return getTeamMembersSuccess(members); })
        .takeUntil(action$.ofType(GET_TEAM_MEMBERS_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getTeamMembersFailure(error.xhr.response)); })["do"](function (x) {
        if (x.type === GET_TEAM_MEMBERS_SUCCESS) {
            var arr = x.payload;
        }
    }); });
}
exports.getTeamMembersEpic = getTeamMembersEpic;
exports.TEAM_SELECTED = "TEAM_SELECTED";
exports.selectTeam = function (team) { return ({ type: exports.TEAM_SELECTED, payload: team }); };
var TEAM_REDUCER_CLEAR_ERROR = "TEAM_REDUCER_CLEAR_ERROR";
exports.clearError = redux_actions_1.createAction(TEAM_REDUCER_CLEAR_ERROR);
exports.TeamInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    teams: new Array(),
    team: null,
    members: null,
    findingTeams: null,
    error: null
});
exports.teamReducer = function (state, action) {
    if (state === void 0) { state = new exports.TeamInitState(); }
    switch (action.type) {
        case CREATE_TEAM_SUCCESS: {
            var teams = state.get("teams");
            var newItems = teams.concat(action.payload.result);
            return state.set("teams", newItems);
        }
        case exports.CREATE_TEAM_FAILURE: {
            return state.set("state", exports.CREATE_TEAM_FAILURE)
                .set("error", action.payload.message);
        }
        case FIND_TEAM_SUCCESS: {
            return state.set("findingTeams", action.payload.result);
        }
        case FIND_TEAM_FAILURE: {
            return state.set("findingTeams", null);
        }
        case FETCH_USER_TEAMS_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case GET_TEAMS_INFO_SUCCESS: {
            return state.set("teams", action.payload.result);
        }
        case GET_TEAMS_INFO_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case exports.TEAM_SELECTED: {
            return state.set("team", action.payload)
                .set("teams", null);
        }
        case GET_TEAM_MEMBERS_SUCCESS: {
            return state.set("members", action.payload);
        }
        case TEAM_REDUCER_CLEAR_ERROR: {
            return state.set("state", null)
                .set("error", null);
        }
        default:
            return state;
    }
};
