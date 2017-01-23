import { combineEpics } from "redux-observable";

import * as userRx from "./user/userRx";
import * as chatroomRxEpic from "./chatroom/chatroomRxEpic";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";
import * as groupRx from "./group/groupRx";

export const rootEpic = combineEpics(
    userRx.fetchUserEpic,
    userRx.fetchContactEpic,
    userRx.fetchAgentEpic,
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

    ///@Group
    groupRx.getOrgGroupEpic,

    ///@ChatRoom
    chatroomRxEpic.getPrivateChatRoomEpic,
    chatroomRxEpic.getPersistendMessageEpic,
    chatroomRxEpic.createPrivateChatRoomEpic,
    chatroomRxEpic.uploadFileEpic
);