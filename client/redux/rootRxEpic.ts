import { combineEpics } from 'redux-observable';

import * as userActions from "./user/userActions";
import * as chatroomRxEpic from "./chatroom/chatroomRxEpic";
import * as authRx from "./authen/authRx";

export const rootEpic = combineEpics(
    userActions.fetchUserEpic,
    userActions.fetchContactEpic,
    userActions.fetchAgentEpic,
    ///@ Signup user.
    authRx.signupUserEpic,
    authRx.authUserEpic,

    chatroomRxEpic.getPrivateChatRoomEpic,
    chatroomRxEpic.getPersistendMessageEpic,
    chatroomRxEpic.createPrivateChatRoomEpic,
    chatroomRxEpic.uploadFileEpic
);