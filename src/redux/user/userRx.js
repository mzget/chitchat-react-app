"use strict";
exports.__esModule = true;
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var UserService = require("../../chitchat/chats/services/UserService");
var StalkBridgeActions = require("../../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
var authRx_1 = require("../authen/authRx");
var configureStore_1 = require("../configureStore");
exports.onAuth_Epic = function (action$) {
    return action$.filter(function (action) { return (action.type === authRx_1.AUTH_USER_SUCCESS || action.type === authRx_1.TOKEN_AUTH_USER_SUCCESS); })
        .map(function (response) { return exports.fetchUser(configureStore_1["default"].getState().authReducer.user); });
};
var FETCH_USER = "FETCH_USER";
exports.FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
exports.FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
exports.FETCH_USER_CANCELLED = "FETCH_USER_CANCELLED";
exports.fetchUser = function (username) { return ({ type: FETCH_USER, payload: username }); }; // username => ({ type: FETCH_USER, payload: username });
var fetchUserFulfilled = function (payload) { return ({ type: exports.FETCH_USER_SUCCESS, payload: payload }); };
var cancelFetchUser = function () { return ({ type: exports.FETCH_USER_CANCELLED }); };
var fetchUserRejected = function (payload) { return ({ type: exports.FETCH_USER_FAILURE, payload: payload }); };
exports.fetchUser_Epic = function (action$) {
    return action$.ofType(FETCH_USER)
        .mergeMap(function (action) { return UserService.fetchUser(action.payload)
        .map(function (response) { return fetchUserFulfilled(response.xhr.response); })
        .takeUntil(action$.ofType(exports.FETCH_USER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(fetchUserRejected(error.xhr.response)); })
        ._do(function (x) {
        if (x.type == exports.FETCH_USER_SUCCESS) {
            if (x.payload.result && x.payload.result.length > 0) {
                var user = x.payload.result[0];
                var stalkReducer = configureStore_1["default"].getState().stalkReducer;
                if (stalkReducer.state !== StalkBridgeActions.STALK_INIT) {
                    StalkBridgeActions.stalkLogin(user);
                }
            }
        }
    }); });
};
var UPDATE_USER_INFO = "UPDATE_USER_INFO";
exports.UPDATE_USER_INFO_SUCCESS = "UPDATE_USER_INFO_SUCCESS";
exports.UPDATE_USER_INFO_FAILURE = "UPDATE_USER_INFO_FAILURE";
exports.UPDATE_USER_INFO_CANCELLED = "UPDATE_USER_INFO_CANCELLED";
exports.updateUserInfo = redux_actions_1.createAction(UPDATE_USER_INFO, function (user) { return user; });
exports.updateUserInfoSuccess = redux_actions_1.createAction(exports.UPDATE_USER_INFO_SUCCESS, function (result) { return result; });
exports.updateUserInfoFailure = redux_actions_1.createAction(exports.UPDATE_USER_INFO_FAILURE, function (error) { return error; });
exports.updateUserInfoCancelled = redux_actions_1.createAction(exports.UPDATE_USER_INFO_CANCELLED);
exports.updateUserInfo_Epic = function (action$) { return (action$.ofType(UPDATE_USER_INFO).mergeMap(function (action) { return ajax({
    method: "POST",
    url: config().api.user + "/userInfo",
    body: JSON.stringify({ user: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1["default"].getState().authReducer.token
    }
}).map(function (json) { return exports.updateUserInfoSuccess(json.response.result); })
    .takeUntil(action$.ofType(exports.UPDATE_USER_INFO_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.updateUserInfoFailure(error.xhr.response)); }); })); };
var FETCH_AGENT_BY_ID = "FETCH_AGENT_BY_ID";
var FETCH_AGENT_BY_ID_SUCCESS = "FETCH_AGENT_BY_ID_SUCCESS";
var FETCH_AGENT_BY_ID_FAILURE = "FETCH_AGENT_BY_ID_FAILURE";
var FETCH_AGENT_BY_ID_CANCELLED = "FETCH_AGENT_BY_ID_CANCELLED";
var fetchAgentById = function (agent_id) { return ({ type: FETCH_AGENT_BY_ID, payload: agent_id }); };
var fetchAgentByIdSuccess = function (payload) { return ({ type: FETCH_AGENT_BY_ID_SUCCESS, payload: payload }); };
var fetchAgentByIdFailure = function (payload) { return ({ type: FETCH_AGENT_BY_ID_FAILURE, payload: payload }); };
var fetchAgentByIdCancelled = function () { return ({ type: FETCH_AGENT_BY_ID_CANCELLED }); };
exports.fetchAgentIdEpic = function (action$) { return (action$.ofType(FETCH_AGENT_BY_ID)
    .margeMap(function (action) { return ajax.getJSON(config().api.user + "/agent/" + action.payload)
    .map(fetchAgentByIdSuccess)
    .takeUntil(action$.ofType(FETCH_AGENT_BY_ID_CANCELLED))["catch"](function (error) { return Rx.Observable.of(fetchAgentByIdFailure(error.xhr.response)); }); })); };
var FETCH_AGENT = "FETCH_AGENT";
exports.FETCH_AGENT_SUCCESS = "FETCH_AGENT_SUCCESS";
var FETCH_AGENT_FAILURE = "FETCH_AGENT_FAILURE";
var FETCH_AGENT_CANCELLED = "FETCH_AGENT_CANCELLED";
exports.fetchAgent = function (agent_id) { return ({ type: FETCH_AGENT, payload: agent_id }); };
var fetchAgentSuccess = function (payload) { return ({ type: exports.FETCH_AGENT_SUCCESS, payload: payload }); };
var fetchAgentFailure = function (payload) { return ({ type: FETCH_AGENT_FAILURE, payload: payload }); };
var fetchAgentCancelled = function () { return ({ type: FETCH_AGENT_CANCELLED }); };
exports.fetchAgentEpic = function (action$) { return (action$.ofType(FETCH_AGENT)
    .mergeMap(function (action) {
    return ajax.getJSON(config().api.user + "/agent/" + action.payload)
        .map(fetchAgentSuccess)
        .takeUntil(action$.ofType(FETCH_AGENT_CANCELLED))["catch"](function (error) { return Rx.Observable.of(fetchAgentFailure(error.xhr.response)); });
})); };
var FETCH_CONTACT = "FETCH_CONTACT";
var FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";
exports.fetchContact = function (contactId) { return ({ type: FETCH_CONTACT, payload: contactId }); };
var fetchContactSuccess = function (payload) { return ({ type: FETCH_CONTACT_SUCCESS, payload: payload }); };
exports.fetchContactEpic = function (action$) { return action$.ofType(FETCH_CONTACT)
    .mergeMap(function (action) {
    return ajax.getJSON(config().api.user + "/contact/?id=" + action.payload)
        .map(fetchContactSuccess)
        .takeUntil(action$.ofType(exports.FETCH_USER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(fetchUserRejected(error.xhr.response)); });
}); };
var GET_TEAM_PROFILE = "GET_TEAM_PROFILE";
exports.GET_TEAM_PROFILE_SUCCESS = "GET_TEAM_PROFILE_SUCCESS";
exports.GET_TEAM_PROFILE_FAILURE = "GET_TEAM_PROFILE_FAILURE";
var GET_TEAM_PROFILE_CANCELLED = "GET_TEAM_PROFILE_CANCELLED";
exports.getTeamProfile = function (team_id) { return ({ type: GET_TEAM_PROFILE, payload: team_id }); };
var getTeamProfileSuccess = function (payload) { return ({ type: exports.GET_TEAM_PROFILE_SUCCESS, payload: payload }); };
var getTeamProfileFailure = function (payload) { return ({ type: exports.GET_TEAM_PROFILE_FAILURE, payload: payload }); };
var getTeamProfileCancelled = function () { return ({ type: GET_TEAM_PROFILE_CANCELLED }); };
exports.getTeamProfileEpic = function (action$) { return (action$.ofType(GET_TEAM_PROFILE)
    .mergeMap(function (action) {
    var token = configureStore_1["default"].getState().authReducer.token;
    return UserService.getTeamProfile(token, action.payload);
})
    .map(function (result) { return getTeamProfileSuccess(result.response.result); })
    .takeUntil(action$.ofType(GET_TEAM_PROFILE_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getTeamProfileFailure(error.xhr.response)); })); };
var UPLOAD_USER_AVATAR = "UPLOAD_USER_AVATAR";
exports.UPLOAD_USER_AVATAR_SUCCESS = "UPLOAD_USER_AVATAR_SUCCESS";
exports.UPLOAD_USER_AVATAR_FAILURE = "UPLOAD_USER_AVATAR_FAILURE";
var UPLOAD_USER_AVATAR_CANCELLED = "UPLOAD_USER_AVATAR_CANCELLED";
exports.uploadUserAvatar = redux_actions_1.createAction(UPLOAD_USER_AVATAR, function (file) { return file; });
exports.uploadUserAvatarSuccess = redux_actions_1.createAction(exports.UPLOAD_USER_AVATAR_SUCCESS, function (result) { return result; });
exports.uploadUserAvatarFailure = redux_actions_1.createAction(exports.UPLOAD_USER_AVATAR_FAILURE, function (error) { return error; });
exports.uploadUserAvatarCancelled = redux_actions_1.createAction(UPLOAD_USER_AVATAR_CANCELLED);
exports.uploadUserAvatar_Epic = function (action$) { return (action$.ofType(UPLOAD_USER_AVATAR)
    .mergeMap(function (action) {
    var body = new FormData();
    body.append("file", action.payload);
    return ajax({
        method: "POST",
        url: config().api.user + "/uploadImage",
        body: body,
        headers: {
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    });
})
    .map(function (json) { return exports.uploadUserAvatarSuccess(json.response); })
    .takeUntil(action$.ofType(UPLOAD_USER_AVATAR_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.uploadUserAvatarFailure(error.xhr.response)); })); };
exports.SUGGEST_USER = "SUGGEST_USER";
exports.SUGGEST_USER_FAILURE = "SUGGEST_USER_FAILURE";
exports.SUGGEST_USER_SUCCESS = "SUGGEST_USER_SUCCESS";
exports.SUGGEST_USER_CANCELLED = "SUGGEST_USER_CANCELLED";
exports.suggestUser = redux_actions_1.createAction(exports.SUGGEST_USER, function (username, team_id) { return ({ username: username, team_id: team_id }); });
exports.suggestUserSuccess = redux_actions_1.createAction(exports.SUGGEST_USER_SUCCESS, function (result) { return result.result; });
exports.suggestUserFailure = redux_actions_1.createAction(exports.SUGGEST_USER_FAILURE, function (error) { return error; });
exports.suggestUserCancelled = redux_actions_1.createAction(exports.SUGGEST_USER_CANCELLED);
exports.suggestUser_Epic = function (action$) {
    return action$.ofType(exports.SUGGEST_USER)
        .mergeMap(function (action) { return UserService.suggestUser(action.payload.username, action.payload.team_id)
        .map(function (response) { return exports.suggestUserSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(exports.SUGGEST_USER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.suggestUserFailure(error.xhr.response)); }); }
    // .do(x => {
    //     if (x.type == SUGGEST_USER_SUCCESS) {
    //         let members = x.payload as Array<ChitChatAccount>;
    //     }
    // })
    );
};
exports.USERRX_EMPTY_STATE = "USERRX_EMPTY_STATE";
exports.emptyState = redux_actions_1.createAction(exports.USERRX_EMPTY_STATE);
