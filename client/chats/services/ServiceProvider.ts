import config from "../../configs/config";

import "isomorphic-fetch";

export const getRoomInfo = (user_id: string, room_id: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/roomInfo?user_id=${user_id}&room_id=${room_id}`);
}

export const getUnreadMessage = (user_id: string, room_id: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${config.api.chatroom}/unreadMessage?user_id=${user_id}&room_id=${room_id}&lastAccessTime=${lastAccessTime}`);
}

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
}

export function getLastAccessRoomInfo(token: string) {
    return fetch(`${config.Stalk.api.user}/lastAccessRoom`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": token
        }
    });
}