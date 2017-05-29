/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var chatlogsActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogsActions");
var teamRx_1 = require("../redux/team/teamRx");
var userRx_1 = require("../redux/user/userRx");
var chatlogRxActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogRxActions");
var configureStore_1 = require("../redux/configureStore");
exports.stalkInitChatlog_Epic = function (action$) {
    return action$.filter(function (action) { return (action.type == chatlogsActions_1.STALK_INIT_CHATLOG || action.type == teamRx_1.TEAM_SELECTED); })
        .map(function (x) {
        if (!!configureStore_1["default"].getState().teamReducer.team) {
            var team_id = configureStore_1["default"].getState().teamReducer.team._id;
            return chatlogRxActions_1.getLastAccessRoom(team_id);
        }
        else {
            return { type: "" };
        }
    });
};
exports.getTeamsInfo_Epic = function (action$) { return (action$.filter(function (action) { return action.type == userRx_1.FETCH_USER_SUCCESS; })
    .map(function (x) {
    var userReducer = configureStore_1["default"].getState().userReducer;
    if (!!userReducer.user.teams && userReducer.user.teams.length > 0) {
        return teamRx_1.getTeamsInfo(userReducer.user.teams);
    }
    else {
        return { type: "" };
    }
})); };
