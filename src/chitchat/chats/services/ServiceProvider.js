import * as Rx from "rxjs/Rx";
import InternalStore, { withToken, apiHeaders, } from "stalk-simplechat";
import { config } from "../../../Chitchat";
const authReducer = () => InternalStore.authStore;
export function getLastAccessRoomInfo(teamId) {
    return fetch(`${config.api.stalk_user}/lastAccessRoom?team_id=${teamId}`, {
        method: "GET",
        headers: withToken(apiHeaders())(authReducer().api_token),
    });
}
export function updateLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: `${config.api.stalk_user}/lastAccessRoom`,
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            room_id: roomId,
            user_id: userId,
        }),
    });
}
export function removeLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: `${config.api.stalk_user}/lastAccessRoom`,
        method: "DELETE",
        headers: apiHeaders(),
        body: JSON.stringify({
            room_id: roomId,
            user_id: userId,
        }),
    });
}
