import { ChitChatFactory } from "../chitchatFactory";
import * as Rx from "rxjs/Rx";

const getConfig = () => ChitChatFactory.getInstance().config;

const chitchat_headers = () => ({
    "Content-Type": "application/json",
    "x-api-key": getConfig().api.apiKey
});
const withToken = (headers) => (token) => {
    headers["x-access-token"] = token;

    return headers;
};

export const getRoomInfo = (room_id: string): Promise<any> => {
    return fetch(`${getConfig().api.chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: chitchat_headers
    });
};

export const getUnreadMessage = (room_id: string, user_id: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${getConfig().api.chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: chitchat_headers
    });
};

export const getOlderMessagesCount = (room_id: string, topEdgeMessageTime: string, queryMessage: boolean) => {
    return fetch(`${getConfig().api.chatroom}/olderMessagesCount/?message=${queryMessage}`, {
        body: JSON.stringify({
            room_id: room_id,
            topEdgeMessageTime: topEdgeMessageTime
        }),
        method: "POST",
        headers: chitchat_headers
    });
};

export const getChatHistory = (room_id: string, lastMessageTime: Date, token: string) => {
    return fetch(`${getConfig().api.chatroom}/getChatHistory`, {
        body: JSON.stringify({
            room_id: room_id,
            lastMessageTime: lastMessageTime
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
};

export function getLastAccessRoomInfo(token: string, team_id: string) {
    return fetch(`${getConfig().Stalk.api.user}/lastAccessRoom/?team_id=${team_id}`, {
        method: "GET",
        headers: withToken(chitchat_headers)(token)
    });
}

export function updateLastAccessRoomInfo(token: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().Stalk.api.user}/lastAccessRoom`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({ room_id: room_id })
    });
}

export function removeLastAccessRoomInfo(user_id: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().Stalk.api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchat_headers,
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}
