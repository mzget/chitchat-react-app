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

    ///@Teams
    teamRx.fetchUserTeamsEpic,

    chatroomRxEpic.getPrivateChatRoomEpic,
    chatroomRxEpic.getPersistendMessageEpic,
    chatroomRxEpic.createPrivateChatRoomEpic,
    chatroomRxEpic.uploadFileEpic
);