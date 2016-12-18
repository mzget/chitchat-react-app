import { combineEpics } from 'redux-observable';
import * as userActions from "./user/userActions";
import * as chatroomRxEpic from "./chatroom/chatroomRxEpic";
export const rootEpic = combineEpics(userActions.fetchUserEpic, userActions.fetchContactEpic, chatroomRxEpic.getPrivateChatRoomEpic, chatroomRxEpic.getPersistendMessageEpic);
