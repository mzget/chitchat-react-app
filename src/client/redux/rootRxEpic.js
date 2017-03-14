"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_observable_1 = require("redux-observable");
const userRx = require("./user/userRx");
const chatroomRxEpic = require("./chatroom/chatroomRxEpic");
const chatlogsActions = require("./chatlogs/chatlogsActions");
const authRx = require("./authen/authRx");
const teamRx = require("./team/teamRx");
const adminRx = require("./admin/adminRx");
const groupRx = require("./group/groupRx");
const privateGroupRxActions = require("./group/privateGroupRxActions");
const editGroupRxActions = require("./group/editGroupRxActions");
exports.rootEpic = redux_observable_1.combineEpics(
// @Admin
adminRx.createNewOrgChartEpic, adminRx.getOrgChartEpic, adminRx.updateUserOrgChartEpic, userRx.fetchUserEpic, userRx.fetchContactEpic, userRx.fetchAgentEpic, userRx.getTeamProfileEpic, userRx.uploadUserAvatar_Epic, userRx.updateUserInfo_Epic, 
///@ Signup user.
authRx.signupUserEpic, authRx.authUserEpic, authRx.tokenAuthUserEpic, authRx.logoutUserEpic, 
///@Teams
teamRx.fetchUserTeamsEpic, teamRx.createNewTeamEpic, teamRx.getTeamsInfoEpic, teamRx.getTeamMembersEpic, teamRx.findTeamEpic, teamRx.joinTeamEpic, 
///@Group
groupRx.getOrgGroup_Epic, groupRx.createOrgGroup_Epic, groupRx.uploadGroupImage_Epic, editGroupRxActions.editGroupDetail_Epic, editGroupRxActions.editGroupMember_Epic, 
/**
 * Private group...
 */
privateGroupRxActions.getPrivateGroup_Epic, privateGroupRxActions.createPrivateGroup_Epic, 
///@ChatRoom
chatroomRxEpic.getPrivateChatRoomEpic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic, 
///@chatlogs
chatlogsActions.updateLastAccessRoomEpic);
