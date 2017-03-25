import config from "../../configs/config";
import * as Rx from "rxjs/Rx";
import "isomorphic-fetch";


const chitchat_headers = {
    "Content-Type": "application/json",
    "x-api-key": config.api.apiKey
};

export const getRoomInfo = (room_id: string, token: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
};

export const getUnreadMessage = (room_id: string, user_id: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: chitchat_headers
    });
};

export const checkOlderMessagesCount = (room_id: string, topEdgeMessageTime: string, token: string) => {
    return fetch(`${config.api.chatroom}/checkOlderMessagesCount`, {
        body: JSON.stringify({
            room_id: room_id,
            topEdgeMessageTime: topEdgeMessageTime
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
};

export const getChatHistory = (room_id: string, lastMessageTime: Date, token: string) => {
    return fetch(`${config.api.chatroom}/getChatHistory`, {
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

export function getLastAccessRoomInfo(token: string) {
    return fetch(`${config.Stalk.api.user}/lastAccessRoom`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}

export function updateLastAccessRoomInfo(token: string, room_id: string) {
    return Rx.Observable.ajax({
        url: `${config.Stalk.api.user}/lastAccessRoom`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({ room_id: room_id })
    });
}

