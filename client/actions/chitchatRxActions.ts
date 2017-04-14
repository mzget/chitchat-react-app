/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import { STALK_INIT_CHATLOG } from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import { TEAM_SELECTED } from "../redux/team/teamRx";
import { getLastAccessRoom } from "../chitchat/chats/redux/chatlogs/chatlogRxActions";

import Store from "../redux/configureStore";

export const stalkInitChatlog_Epic = action$ =>
    action$.filter(action => (action.type == STALK_INIT_CHATLOG || action.type == TEAM_SELECTED))
        .map((x) => {
            if (!!Store.getState().teamReducer.team) {
                let team_id = Store.getState().teamReducer.team._id;

                return getLastAccessRoom(team_id);
            }
            else {
                return { type: "" };
            }
        });