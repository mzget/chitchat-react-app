"use strict";
var redux_observable_1 = require("redux-observable");
var userRx = require("./user/userRx");
var chatroomRxEpic = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
var chatlogRxActions = require("../chitchat/chats/redux/chatlogs/chatlogRxActions");
var authRx = require("./authen/authRx");
var teamRx = require("./team/teamRx");
var adminRx = require("./admin/adminRx");
var groupRx = require("./group/groupRx");
var privateGroupRxActions = require("./group/privateGroupRxActions");
var editGroupRxActions = require("./group/editGroupRxActions");
var chitchatRxActions = require("../actions/chitchatRxActions");
exports.rootEpic = redux_observable_1.combineEpics(
// @Admin
adminRx.createNewOrgChartEpic, adminRx.getOrgChartEpic, adminRx.updateUserOrgChartEpic, adminRx.updateUserTeamRole_Epic, userRx.onAuth_Epic, userRx.fetchUser_Epic, userRx.suggestUser_Epic, userRx.fetchContactEpic, userRx.fetchAgentEpic, userRx.getTeamProfileEpic, userRx.uploadUserAvatar_Epic, userRx.updateUserInfo_Epic, 
///@ Signup user.
authRx.signupUserEpic, authRx.authUser_Epic, authRx.tokenAuthUserEpic, authRx.logoutUser_Epic, 
///@Teams
teamRx.fetchUserTeamsEpic, teamRx.createNewTeamEpic, teamRx.getTeamsInfoEpic, teamRx.getTeamMembersEpic, teamRx.findTeamEpic, teamRx.joinTeamEpic, 
///@Group
groupRx.getOrgGroup_Epic, groupRx.createOrgGroup_Epic, groupRx.uploadGroupImage_Epic, editGroupRxActions.editGroupDetail_Epic, editGroupRxActions.editGroupMember_Epic, editGroupRxActions.addGroupMember_Epic, editGroupRxActions.removeGroupMember_Epic, 
/**
 * Private group...
 */
privateGroupRxActions.getPrivateGroup_Epic, privateGroupRxActions.createPrivateGroup_Epic, 
///@ChatRoom
chatroomRxEpic.getPrivateChatRoom_Epic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic, chatroomRxEpic.updateMessagesRead_Epic, 
/// @message rx.
// messageRxEpic.fetchOlderMessageCount_Epic,
///@chatlogs
chatlogRxActions.getLastAccessRoom_Epic, chatlogRxActions.updateLastAccessRoom_Epic, 
// chatlogRxActions.stalkInitChatlogs_Epic
chatlogRxActions.removeRoomAccess_Epic, chitchatRxActions.stalkInitChatlog_Epic, chitchatRxActions.getTeamsInfo_Epic);
