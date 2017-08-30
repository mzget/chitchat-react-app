import * as Rx from "rxjs/Rx";

import { ChitChatFactory } from "../ChitChatFactory";
import { withToken, chitchat_headers } from "../utils/chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;


export function getLastAccessRoomInfo(team_id: string) {
    return fetch(`${getConfig().api.stalk_user}/lastAccessRoom?team_id=${team_id}`, {
        method: "GET",
        headers: withToken(chitchat_headers())(authReducer().chitchat_token)
    });
}

export function updateLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().api.stalk_user}/lastAccessRoom`,
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
        url: `${getConfig().api.stalk_user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}

