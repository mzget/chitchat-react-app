import { combineEpics } from "redux-observable";

import * as userRx from "./user/userRx";
import * as chatroomRxEpic from "./chatroom/chatroomRxEpic";
import * as chatlogsActions from "./chatlogs/chatlogsActions";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";
import * as adminRx from "./admin/adminRx";
import * as groupRx from "./group/groupRx";
import * as privateGroupRxActions from "./group/privateGroupRxActions";
import * as editGroupRxActions from "./group/editGroupRxActions";

export const rootEpic = combineEpics(
    // @Admin
    adminRx.createNewOrgChartEpic,
    adminRx.getOrgChartEpic,
    adminRx.updateUserOrgChartEpic,

    userRx.fetchUserEpic,
    userRx.fetchContactEpic,
    userRx.fetchAgentEpic,
    userRx.getTeamProfileEpic,
    userRx.uploadUserAvatar_Epic,
    userRx.updateUserInfo_Epic,

    ///@ Signup user.
    authRx.signupUserEpic,
    authRx.authUserEpic,
    authRx.tokenAuthUserEpic,
    authRx.logoutUserEpic,

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

    /**
     * Private group...
     */
    privateGroupRxActions.getPrivateGroup_Epic,
    privateGroupRxActions.createPrivateGroup_Epic,

    ///@ChatRoom
    chatroomRxEpic.getPrivateChatRoomEpic,
    chatroomRxEpic.getPersistendMessageEpic,
    chatroomRxEpic.createPrivateChatRoomEpic,
    chatroomRxEpic.uploadFileEpic,

    ///@chatlogs
    chatlogsActions.updateLastAccessRoomEpic
);