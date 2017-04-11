/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import { STALK_INIT_CHATLOG } from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import { getLastAccessRoom } from "../chitchat/chats/redux/chatlogs/chatlogRxActions";

import Store from "../redux/configureStore";

// export const removeRoomAccess = (room_id: string) => ({ type: STALK_REMOVE_ROOM_ACCESS, payload: room_id });
// const removeRoomAccess_Success = (payload) => ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload });
// const removeRoomAccess_Cancelled = () => ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED });
// const removeRoomAccess_Failure = error => ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error });
export const stalkInitChatlog_Epic = action$ => (
    action$.ofType(STALK_INIT_CHATLOG)
        .delay(1000)
        .map((x) => {
            if (!!Store.getState().teamReducer.team) {
                let token = Store.getState().authReducer.token;
                let team_id = Store.getState().teamReducer.team._id;

                return getLastAccessRoom(token, team_id);
            }
            else {
                return { type: STALK_INIT_CHATLOG };
            }
        })
        .catch((error) => Rx.Observable.of({ type: STALK_INIT_CHATLOG }))
);