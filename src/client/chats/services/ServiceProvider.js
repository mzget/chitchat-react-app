"use strict";
const config_1 = require("../../configs/config");
require("isomorphic-fetch");
exports.getRoomInfo = (user_id, room_id) => {
    return fetch(`${config_1.default.api.chatroom}/roomInfo?user_id=${user_id}&room_id=${room_id}`);
};
exports.getUnreadMessage = (user_id, room_id, lastAccessTime) => {
    return fetch(`${config_1.default.api.chatroom}/unreadMessage?user_id=${user_id}&room_id=${room_id}&lastAccessTime=${lastAccessTime}`);
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
