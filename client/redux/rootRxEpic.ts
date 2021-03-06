import { combineEpics } from "redux-observable";

import * as userRx from "./user/userRx";
import * as chatroom from "../chitchat/chats/redux/chatroom/";
import * as chatlogsActions from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as chatlogRxActions from "../chitchat/chats/redux/chatlogs/chatlogRxActions";
import * as calling from "../chitchat/calling/";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";
import * as adminRx from "./admin/adminRx";
import * as groupRx from "./group/groupRx";
import * as privateGroupRxActions from "./group/privateGroupRxActions";
import * as editGroupRxActions from "./group/editGroupRxActions";
import { stalkInitChatlog_Epic, getTeamsInfo_Epic } from "../actions/";

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

    ///@ Signup user.
    authRx.signupUserEpic,
    authRx.authUser_Epic,
    authRx.authSocial_Epic,
    authRx.SignupSocial_Epic,
    authRx.tokenAuthUserEpic,
    authRx.logoutUser_Epic,

    ///@Teams
    teamRx.fetchUserTeamsEpic,
    teamRx.createNewTeamEpic,
    teamRx.getTeamsInfoEpic,
    teamRx.getTeamMembersEpic,
    teamRx.findTeamEpic,
    teamRx.joinTeamEpic,

    ///@Group
    groupRx.getOrgGroup_Epic,
    groupRx.createOrgGroup_Epic,
    groupRx.uploadGroupImage_Epic,
    editGroupRxActions.editGroupDetail_Epic,
    editGroupRxActions.editGroupMember_Epic,
    editGroupRxActions.addGroupMember_Epic,
    editGroupRxActions.removeGroupMember_Epic,

    /**
     * Private group...
     */
    privateGroupRxActions.getPrivateGroup_Epic,
    privateGroupRxActions.createPrivateGroup_Epic,

    ///@ChatRoom
    chatroom.getPrivateChatRoom_Epic,
    chatroom.getPersistendMessageEpic,
    chatroom.createPrivateChatRoomEpic,
    chatroom.uploadFileEpic,
    chatroom.updateMessagesRead_Epic,
    /// @message rx.
    // messageRxEpic.fetchOlderMessageCount_Epic,
    calling.hangupVideoCall_Epic,

    ///@chatlogs
    chatlogRxActions.getLastAccessRoom_Epic,
    chatlogRxActions.updateLastAccessRoom_Epic,
    // chatlogRxActions.stalkInitChatlogs_Epic
    chatlogRxActions.removeRoomAccess_Epic,

    stalkInitChatlog_Epic,
    getTeamsInfo_Epic
);