"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../configs/config");
const Rx = require("rxjs/Rx");
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
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
exports.getLastAccessRoomInfo = getLastAccessRoomInfo;
function updateLastAccessRoomInfo(token, room_id) {
    return Rx.Observable.ajax({
        url: `${config_1.default.Stalk.api.user}/lastAccessRoom`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        },
        body: JSON.stringify({ room_id: room_id })
    });
}
exports.updateLastAccessRoomInfo = updateLastAccessRoomInfo;
