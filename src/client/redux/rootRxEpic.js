"use strict";
const redux_observable_1 = require("redux-observable");
const userActions = require("./user/userActions");
const chatroomRxEpic = require("./chatroom/chatroomRxEpic");
exports.rootEpic = redux_observable_1.combineEpics(userActions.fetchUserEpic, userActions.fetchContactEpic, userActions.fetchAgentEpic, chatroomRxEpic.getPrivateChatRoomEpic, chatroomRxEpic.getPersistendMessageEpic, chatroomRxEpic.createPrivateChatRoomEpic, chatroomRxEpic.uploadFileEpic);
