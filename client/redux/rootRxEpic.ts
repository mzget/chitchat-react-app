import { combineEpics } from "redux-observable";

import * as userRx from "./user/userRx";
import * as chatroomRxEpic from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import * as messageRxEpic from "../chitchat/chats/redux/chatroom/messageRxEpic";
import * as chatlogsActions from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as chatlogRxActions from "../chitchat/chats/redux/chatlogs/chatlogRxActions";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";
import * as adminRx from "./admin/adminRx";
import * as groupRx from "./group/groupRx";
import * as privateGroupRxActions from "./group/privateGroupRxActions";
import * as editGroupRxActions from "./group/editGroupRxActions";
import * as chitchatRxActions from "../actions/chitchatRxActions";

export const rootEpic = combineEpics(
    // @Admin
    adminRx.createNewOrgChartEpic,
    adminRx.getOrgChartEpic,
    adminRx.updateUserOrgChartEpic,

    userRx.onAuth_Epic,
    userRx.fetchUserEpic,
    userRx.fetchContactEpic,
    userRx.fetchAgentEpic,
    userRx.getTeamProfileEpic,
    userRx.uploadUserAvatar_Epic,
    userRx.updateUserInfo_Epic,

    ///@ Signup user.
    authRx.signupUserEpic,
    authRx.authUser_Epic,
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
    /// @message rx.
    // messageRxEpic.fetchOlderMessageCount_Epic,

    ///@chatlogs
    chatlogRxActions.getLastAccessRoom_Epic,
    chatlogRxActions.updateLastAccessRoom_Epic,
    // chatlogRxActions.stalkInitChatlogs_Epic
    chatlogRxActions.removeRoomAccess_Epic,

    chitchatRxActions.stalkInitChatlog_Epic
);