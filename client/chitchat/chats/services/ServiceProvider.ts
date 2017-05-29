import * as Rx from "rxjs/Rx";

import { ChitChatFactory } from "../ChitchatFactory";
import { withToken, chitchat_headers } from "../utils/chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;


export function getLastAccessRoomInfo(team_id: string) {
    return fetch(`${getConfig().Stalk.api.user}/lastAccessRoom/?team_id=${team_id}`, {
        method: "GET",
        headers: withToken(chitchat_headers())(authReducer().chitchat_token)
    });
}

export function updateLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().Stalk.api.user}/lastAccessRoom`,
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({
            room_id: room_id,
            user_id: user_id
        })
    });
}

export function removeLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().Stalk.api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}

