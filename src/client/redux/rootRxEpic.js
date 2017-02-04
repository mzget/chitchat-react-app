"use strict";
const redux_observable_1 = require("redux-observable");
const userRx = require("./user/userRx");
const chatroomRxEpic = require("./chatroom/chatroomRxEpic");
const chatlogsActions = require("./chatlogs/chatlogsActions");
const authRx = require("./authen/authRx");
const teamRx = require("./team/teamRx");
const groupRx = require("./group/groupRx");
const adminRx = require("./admin/adminRx");
exports.rootEpic = redux_observable_1.combineEpics(
// @Admin
adminRx.createNewOrgChartEpic, adminRx.getOrgChartEpic, adminRx.updateUserOrgChartEpic, userRx.fetchUserEpic, userRx.fetchContactEpic, userRx.fetchAgentEpic, 
///@ Signup user.
authRx.signupUserEpic, authRx.authUserEpic, authRx.tokenAuthUserEpic, authRx.logoutUserEpic, 
///@Teams
teamRx.fetchUserTeamsEpic, teamRx.createNewTeamEpic, teamRx.getTeamsInfoEpic, teamRx.getTeamMembersEpic, teamRx.findTeamEpic, teamRx.joinTeamEpic, 
///@Group
groupRx.getOrgGroupEpic, groupRx.createGroupEpic, 
///@ChatRoom
chatroomRxEpic.getPrivateChatRoomEpic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic, 
///@chatlogs
chatlogsActions.updateLastAccessRoomEpic);
