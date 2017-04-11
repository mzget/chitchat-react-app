/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const chatlogsActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogsActions");
const chatlogRxActions_1 = require("../chitchat/chats/redux/chatlogs/chatlogRxActions");
const configureStore_1 = require("../redux/configureStore");
// export const removeRoomAccess = (room_id: string) => ({ type: STALK_REMOVE_ROOM_ACCESS, payload: room_id });
// const removeRoomAccess_Success = (payload) => ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload });
// const removeRoomAccess_Cancelled = () => ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED });
// const removeRoomAccess_Failure = error => ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error });
exports.stalkInitChatlog_Epic = action$ => (action$.ofType(chatlogsActions_1.STALK_INIT_CHATLOG)
    .delay(1000)
    .map((x) => {
    if (!!configureStore_1.default.getState().teamReducer.team) {
        let token = configureStore_1.default.getState().authReducer.token;
        let team_id = configureStore_1.default.getState().teamReducer.team._id;
        return chatlogRxActions_1.getLastAccessRoom(token, team_id);
    }
    else {
        return { type: chatlogsActions_1.STALK_INIT_CHATLOG };
    }
})
    .catch((error) => Rx.Observable.of({ type: chatlogsActions_1.STALK_INIT_CHATLOG })));
