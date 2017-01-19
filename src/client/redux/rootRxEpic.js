"use strict";
const redux_observable_1 = require("redux-observable");
const userActions = require("./user/userActions");
const chatroomRxEpic = require("./chatroom/chatroomRxEpic");
const authRx = require("./authen/authRx");
const teamRx = require("./team/teamRx");
exports.rootEpic = redux_observable_1.combineEpics(userActions.fetchUserEpic, userActions.fetchContactEpic, userActions.fetchAgentEpic, 
///@ Signup user.
authRx.signupUserEpic, authRx.authUserEpic, 
///@Teams
teamRx.fetchUserTeamsEpic, chatroomRxEpic.getPrivateChatRoomEpic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic);
