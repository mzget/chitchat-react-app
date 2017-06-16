"use strict";
var Rx = require("rxjs");
var ajax = Rx.Observable.ajax, AjaxResponse = Rx.AjaxResponse;
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var configureStore_1 = require("../configureStore");
var chatroomActions_1 = require("../../chitchat/chats/redux/chatroom/chatroomActions");
exports.SET_PRIVATE_GROUP = "SET_PRIVATE_GROUP";
var GET_PRIVATE_GROUP = "GET_PRIVATE_GROUP";
exports.GET_PRIVATE_GROUP_SUCCESS = "GET_PRIVATE_GROUP_SUCCESS";
exports.GET_PRIVATE_GROUP_FAILURE = "GET_PRIVATE_GROUP_FAILURE";
var GET_PRIVATE_GROUP_CANCELLED = "GET_PRIVATE_GROUP_CANCELLED";
exports.getPrivateGroup = function (team_id) { return ({ type: GET_PRIVATE_GROUP, payload: team_id }); };
var getPrivateGroupSuccess = function (payload) { return ({ type: exports.GET_PRIVATE_GROUP_SUCCESS, payload: payload }); };
var getPrivateGroupFailure = function (err) { return ({ type: exports.GET_PRIVATE_GROUP_FAILURE, payload: err }); };
var getPrivateGroupCancelled = function () { return ({ type: GET_PRIVATE_GROUP_CANCELLED }); };
exports.getPrivateGroup_Epic = function (action$) { return (action$.ofType(GET_PRIVATE_GROUP)
    .mergeMap(function (action) { return ajax.getJSON(config().api.group + "/private_group?team_id=" + action.payload, { "x-access-token": configureStore_1["default"].getState().authReducer.token })
    .map(function (response) { return getPrivateGroupSuccess(response); })
    .takeUntil(action$.ofType(GET_PRIVATE_GROUP_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getPrivateGroupFailure(error.xhr.response)); })["do"](function (response) {
    if (response.type == exports.GET_PRIVATE_GROUP_SUCCESS) {
        var rooms = response.payload.result;
        configureStore_1["default"].dispatch(chatroomActions_1.updateChatRoom(rooms));
    }
}); })); };
var CREATE_PRIVATE_GROUP = "CREATE_PRIVATE_GROUP";
exports.CREATE_PRIVATE_GROUP_SUCCESS = "CREATE_PRIVATE_GROUP_SUCCESS";
exports.CREATE_PRIVATE_GROUP_FAILURE = "CREATE_PRIVATE_GROUP_FAILURE";
var CREATE_PRIVATE_GROUP_CANCELLED = "CREATE_PRIVATE_GROUP_CANCELLED";
exports.createPrivateGroup = function (group) { return ({ type: CREATE_PRIVATE_GROUP, payload: group }); };
exports.createPrivateGroupSuccess = function (result) { return ({ type: exports.CREATE_PRIVATE_GROUP_SUCCESS, payload: result }); };
exports.createPrivateGroupFailure = function (error) { return ({ type: exports.CREATE_PRIVATE_GROUP_FAILURE, payload: error }); };
exports.createPrivateGroupCancelled = function () { return ({ type: CREATE_PRIVATE_GROUP_CANCELLED }); };
exports.createPrivateGroup_Epic = function (action$) { return (action$.ofType(CREATE_PRIVATE_GROUP).mergeMap(function (action) { return ajax({
    method: "POST",
    url: config().api.group + "/private_group/create",
    body: JSON.stringify({ room: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1["default"].getState().authReducer.token
    }
})
    .map(function (json) { return exports.createPrivateGroupSuccess(json.response.result); })
    .takeUntil(action$.ofType(CREATE_PRIVATE_GROUP_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.createPrivateGroupFailure(error.xhr.response)); }); })); };
