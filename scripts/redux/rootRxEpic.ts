import { combineEpics } from "redux-observable";

import * as userRx from "./user/userRx";
import * as chatroom from "stalk-simplechat/app/redux/chatroom/chatroomRxEpic";
import { updateLastAccessRoomEpic, removeRoomAccessEpic } from "stalk-simplechat/app/redux/chatlogs/chatlogRxActions";
import * as calling from "../chitchat/calling/";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";
import * as adminRx from "./admin/adminRx";
import * as groupRx from "./group/groupRx";
import * as privateGroupRxActions from "./group/privateGroupRxActions";
import * as editGroupRxActions from "./group/editGroupRxActions";

import { stalkInitChatlogEpic, getTeamsInfoEpic, stalkInitSuccessEpic } from "../actions/chitchatRxActions";
import { getLastAccessRoomEpic } from "./chatlogs/chatlogRxActions";

export const rootEpic = combineEpics(
    // @Admin
    adminRx.createNewOrgChartEpic,
    adminRx.getOrgChartEpic,
    adminRx.updateUserOrgChartEpic,
    adminRx.updateUserTeamRole_Epic,

    userRx.onAuth_Epic,
    userRx.fetchUser_Epic,
    userRx.suggestUser_Epic,
    userRx.fetchContactEpic,
    userRx.fetchAgentEpic,
    userRx.getTeamProfileEpic,
    userRx.uploadUserAvatar_Epic,
    userRx.updateUserInfo_Epic,
    userRx.saveDeviceToken_Epic,

    /// @ Signup user.
    authRx.signupUserEpic,
    authRx.authUserEpic,
    authRx.authSocial_Epic,
    authRx.SignupSocial_Epic,
    authRx.tokenAuthUserEpic,
    authRx.logoutUser_Epic,

    /// @Teams
    teamRx.fetchUserTeamsEpic,
    teamRx.createNewTeamEpic,
    teamRx.getTeamsInfoEpic,
    teamRx.getTeamMembersEpic,
    teamRx.findTeamEpic,
    teamRx.joinTeamEpic,

    /// @Group
    groupRx.getOrgGroupEpic,
    groupRx.createOrgGroupEpic,
    groupRx.uploadGroupImageEpic,
    editGroupRxActions.editGroupDetail_Epic,
    editGroupRxActions.editGroupMember_Epic,
    editGroupRxActions.addGroupMember_Epic,
    editGroupRxActions.removeGroupMember_Epic,

    /**
     * Private group...
     */
    privateGroupRxActions.getPrivateGroup_Epic,
    privateGroupRxActions.createPrivateGroup_Epic,

    /// @ChatRoom
    chatroom.getPrivateChatRoomEpic,
    chatroom.createPrivateChatRoomEpic,
    chatroom.uploadFileEpic,
    /// @message rx.
    // messageRxEpic.fetchOlderMessageCount_Epic,
    calling.hangupVideoCall_Epic,

    /// @chatlogs
    getLastAccessRoomEpic,
    updateLastAccessRoomEpic,
    removeRoomAccessEpic,

    stalkInitSuccessEpic,
    stalkInitChatlogEpic,
    getTeamsInfoEpic,
);
