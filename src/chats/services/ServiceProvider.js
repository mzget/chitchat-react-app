"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../configs/config");
const Rx = require("rxjs/Rx");
require("isomorphic-fetch");
const chitchat_headers = {
    "Content-Type": "application/json",
    "x-api-key": config_1.default.api.apiKey
};
const withToken = (headers) => (token) => {
    headers["x-access-token"] = token;
    return headers;
};
exports.getRoomInfo = (room_id) => {
    return fetch(`${config_1.default.api.chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: chitchat_headers
    });
};
exports.getUnreadMessage = (room_id, user_id, lastAccessTime) => {
    return fetch(`${config_1.default.api.chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: chitchat_headers
    });
};
exports.getOlderMessagesCount = (room_id, topEdgeMessageTime, queryMessage) => {
    return fetch(`${config_1.default.api.chatroom}/olderMessagesCount/?message=${queryMessage}`, {
        body: JSON.stringify({
            room_id: room_id,
            topEdgeMessageTime: topEdgeMessageTime
        }),
        method: "POST",
        headers: chitchat_headers
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
function getLastAccessRoomInfo(token, team_id) {
    return fetch(`${config_1.default.Stalk.api.user}/lastAccessRoom/?team_id=${team_id}`, {
        method: "GET",
        headers: withToken(chitchat_headers)(token)
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
function removeLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: `${config_1.default.Stalk.api.user}/lastAccessRoom`,
        method: "DELETE",
        headers: chitchat_headers,
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}
exports.removeLastAccessRoomInfo = removeLastAccessRoomInfo;
