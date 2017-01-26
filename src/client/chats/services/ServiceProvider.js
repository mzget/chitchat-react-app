"use strict";
const config_1 = require("../../configs/config");
require("isomorphic-fetch");
exports.getRoomInfo = (room_id, token) => {
    return fetch(`${config_1.default.api.chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
};
exports.getUnreadMessage = (room_id, lastAccessTime, token) => {
    return fetch(`${config_1.default.api.chatroom}/unreadMessage?room_id=${room_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
};
exports.checkOlderMessagesCount = (room_id, topEdgeMessageTime, token) => {
    return fetch(`${config_1.default.api.chatroom}/checkOlderMessagesCount`, {
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
exports.getChatHistory = (room_id, lastMessageTime, token) => {
    return fetch(`${config_1.default.api.chatroom}/getChatHistory`, {
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
function getLastAccessRoomInfo(token) {
    return fetch(`${config_1.default.Stalk.api.user}/lastAccessRoom`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": token
        }
    });
}
exports.getLastAccessRoomInfo = getLastAccessRoomInfo;
