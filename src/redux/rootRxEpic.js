"use strict";
const redux_observable_1 = require("redux-observable");
const userRx = require("./user/userRx");
const chatroomRxEpic = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
const chatlogRxActions = require("../chitchat/chats/redux/chatlogs/chatlogRxActions");
const authRx = require("./authen/authRx");
const teamRx = require("./team/teamRx");
const adminRx = require("./admin/adminRx");
const groupRx = require("./group/groupRx");
const privateGroupRxActions = require("./group/privateGroupRxActions");
const editGroupRxActions = require("./group/editGroupRxActions");
const chitchatRxActions = require("../actions/chitchatRxActions");
exports.rootEpic = redux_observable_1.combineEpics(
// @Admin
adminRx.createNewOrgChartEpic, adminRx.getOrgChartEpic, adminRx.updateUserOrgChartEpic, adminRx.updateUserTeamRole_Epic, userRx.onAuth_Epic, userRx.fetchUserEpic, userRx.fetchContactEpic, userRx.fetchAgentEpic, userRx.getTeamProfileEpic, userRx.uploadUserAvatar_Epic, userRx.updateUserInfo_Epic, 
///@ Signup user.
authRx.signupUserEpic, authRx.authUser_Epic, authRx.tokenAuthUserEpic, authRx.logoutUser_Epic, 
///@Teams
teamRx.fetchUserTeamsEpic, teamRx.createNewTeamEpic, teamRx.getTeamsInfoEpic, teamRx.getTeamMembersEpic, teamRx.findTeamEpic, teamRx.joinTeamEpic, 
///@Group
groupRx.getOrgGroup_Epic, groupRx.createOrgGroup_Epic, groupRx.uploadGroupImage_Epic, editGroupRxActions.editGroupDetail_Epic, editGroupRxActions.editGroupMember_Epic, 
/**
 * Private group...
 */
privateGroupRxActions.getPrivateGroup_Epic, privateGroupRxActions.createPrivateGroup_Epic, 
///@ChatRoom
chatroomRxEpic.getPrivateChatRoom_Epic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic, 
/// @message rx.
// messageRxEpic.fetchOlderMessageCount_Epic,
///@chatlogs
chatlogRxActions.getLastAccessRoom_Epic, chatlogRxActions.updateLastAccessRoom_Epic, 
// chatlogRxActions.stalkInitChatlogs_Epic
chatlogRxActions.removeRoomAccess_Epic, chitchatRxActions.stalkInitChatlog_Epic, chitchatRxActions.getTeamsInfo_Epic);
