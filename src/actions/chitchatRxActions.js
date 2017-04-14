/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const chatlogsActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogsActions");
const teamRx_1 = require("../redux/team/teamRx");
const chatlogRxActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogRxActions");
const configureStore_1 = require("../redux/configureStore");
exports.stalkInitChatlog_Epic = action$ => action$.filter(action => (action.type == chatlogsActions_1.STALK_INIT_CHATLOG || action.type == teamRx_1.TEAM_SELECTED))
    .map((x) => {
    if (!!configureStore_1.default.getState().teamReducer.team) {
        let team_id = configureStore_1.default.getState().teamReducer.team._id;
        return chatlogRxActions_1.getLastAccessRoom(team_id);
    }
    else {
        return { type: "" };
    }
});
