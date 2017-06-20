"use strict";
exports.__esModule = true;
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var configureStore_1 = require("../configureStore");
var chatroomActions_1 = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
/**
 * Get org groups...
 */
var GET_ORG_GROUP = "GET_ORG_GROUP";
exports.GET_ORG_GROUP_SUCCESS = "GET_ORG_GROUP_SUCCESS";
var GET_ORG_GROUP_FAILURE = "GET_ORG_GROUP_FAILURE";
var GET_ORG_GROUP_CANCELLED = "GET_ORG_GROUP_CANCELLED";
exports.getOrgGroup = function (team_id) { return ({ type: GET_ORG_GROUP, payload: team_id }); };
var getOrgGroupSuccess = function (payload) { return ({ type: exports.GET_ORG_GROUP_SUCCESS, payload: payload }); };
var getOrgGroupFailure = function (err) { return ({ type: GET_ORG_GROUP_FAILURE, payload: err }); };
var getOrgGroupCancelled = function () { return ({ type: GET_ORG_GROUP_CANCELLED }); };
exports.getOrgGroup_Epic = function (action$) { return (action$.ofType(GET_ORG_GROUP)
    .mergeMap(function (action) { return ajax.getJSON(config().api.group + "/org?team_id=" + action.payload, { "x-access-token": configureStore_1["default"].getState().authReducer.token }).map(function (response) { return getOrgGroupSuccess(response); })
    .takeUntil(action$.ofType(GET_ORG_GROUP_CANCELLED))["catch"](function (error) { return Rx.Observable.of(getOrgGroupFailure(error.xhr.response)); })["do"](function (response) {
    if (response.type == exports.GET_ORG_GROUP_SUCCESS) {
        var rooms = response.payload.result;
        configureStore_1["default"].dispatch(chatroomActions_1.updateChatRoom(rooms));
    }
}); })); };
/**
 * Create org groups...
 */
var CREATE_ORG_GROUP = "CREATE_ORG_GROUP";
exports.CREATE_ORG_GROUP_FAILURE = "CREATE_ORG_GROUP_FAILURE";
exports.CREATE_ORG_GROUP_SUCCESS = "CREATE_ORG_GROUP_SUCCESS";
var CREATE_ORG_GROUP_CANCELLED = "CREATE_ORG_GROUP_CANCELLED";
exports.createOrgGroup = function (group) { return ({ type: CREATE_ORG_GROUP, payload: group }); };
var createOrgGroupSuccess = redux_actions_1.createAction(exports.CREATE_ORG_GROUP_SUCCESS, function (payload) { return payload; });
var createOrgGroupFailure = redux_actions_1.createAction(exports.CREATE_ORG_GROUP_FAILURE, function (err) { return err; });
var createOrgGroupCancelled = redux_actions_1.createAction(CREATE_ORG_GROUP_CANCELLED);
exports.createOrgGroup_Epic = function (action$) { return (action$.ofType(CREATE_ORG_GROUP).mergeMap(function (action) { return ajax({
    method: "POST",
    url: config().api.group + "/org/create",
    body: JSON.stringify({ room: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1["default"].getState().authReducer.token
    }
}).map(function (json) { return createOrgGroupSuccess(json.response.result); })
    .takeUntil(action$.ofType(CREATE_ORG_GROUP_CANCELLED))["catch"](function (error) { return Rx.Observable.of(createOrgGroupFailure(error.xhr.response)); }); })); };
exports.GROUP_RX_EMPTY_STATE = "GROUP_RX_EMPTY_STATE";
exports.emptyState = function () { return ({ type: exports.GROUP_RX_EMPTY_STATE }); };
exports.UPLOAD_GROUP_IMAGE = "UPLOAD_GROUP_IMAGE";
exports.UPLOAD_GROUP_IMAGE_SUCCESS = "UPLOAD_GROUP_IMAGE_SUCCESS";
exports.UPLOAD_GROUP_IMAGE_FAILURE = "UPLOAD_GROUP_IMAGE_FAILURE";
var UPLOAD_GROUP_IMAGE_CANCELLED = "UPLOAD_GROUP_IMAGE_CANCELLED";
exports.uploadGroupImage = redux_actions_1.createAction(exports.UPLOAD_GROUP_IMAGE, function (file) { return file; });
exports.uploadGroupImageFailure = redux_actions_1.createAction(exports.UPLOAD_GROUP_IMAGE_FAILURE, function (error) { return error; });
exports.uploadGroupImageSuccess = redux_actions_1.createAction(exports.UPLOAD_GROUP_IMAGE_SUCCESS, function (result) { return result; });
exports.uploadGroupImageCancelled = redux_actions_1.createAction(UPLOAD_GROUP_IMAGE_CANCELLED);
exports.uploadGroupImage_Epic = function (action$) { return (action$.ofType(exports.UPLOAD_GROUP_IMAGE)
    .mergeMap(function (action) {
    var body = new FormData();
    body.append("file", action.payload);
    return ajax({
        method: "POST",
        url: config().api.group + "/uploadImage",
        body: body,
        headers: {
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    });
})
    .map(function (json) { return exports.uploadGroupImageSuccess(json.response); })
    .takeUntil(action$.ofType(UPLOAD_GROUP_IMAGE_CANCELLED))["catch"](function (error) { return Rx.Observable.of(exports.uploadGroupImageFailure(error.xhr.response)); })); };
