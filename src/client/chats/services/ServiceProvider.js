"use strict";
const config_1 = require("../../configs/config");
require('isomorphic-fetch');
exports.getRoomInfo = (user_id, room_id) => {
    return fetch(`${config_1.default.api.chatroom}/roomInfo?user_id=${user_id}&room_id=${room_id}`);
};
exports.getUnreadMessage = (user_id, room_id, lastAccessTime) => {
    return fetch(`${config_1.default.api.chatroom}/unreadMessage?user_id=${user_id}&room_id=${room_id}&lastAccessTime=${lastAccessTime}`);
};
