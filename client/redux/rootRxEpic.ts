import { combineEpics } from 'redux-observable';

import * as userActions from "./user/userActions";
import * as chatroomRxEpic from "./chatroom/chatroomRxEpic";
import * as authRx from "./authen/authRx";
import * as teamRx from "./team/teamRx";

export const rootEpic = combineEpics(
    userActions.fetchUserEpic,
    userActions.fetchContactEpic,
    userActions.fetchAgentEpic,
    ///@ Signup user.
    authRx.signupUserEpic,
    authRx.authUserEpic,
    authRx.tokenAuthUserEpic,

    ///@Teams
    teamRx.fetchUserTeamsEpic,
    teamRx.createNewTeamEpic,
    teamRx.getTeamsInfoEpic,

    chatroomRxEpic.getPrivateChatRoomEpic,
    chatroomRxEpic.getPersistendMessageEpic,
    chatroomRxEpic.createPrivateChatRoomEpic,
    chatroomRxEpic.uploadFileEpic
);