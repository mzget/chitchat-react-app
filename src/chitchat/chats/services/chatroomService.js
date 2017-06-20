"use strict";
exports.__esModule = true;
var ChitchatFactory_1 = require("../ChitchatFactory");
var chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
exports.getRoomInfo = function (room_id) {
    return fetch(getConfig().api.chatroom + "/roomInfo?room_id=" + room_id, {
        method: "GET",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(authReducer().chitchat_token)
    });
};
exports.getUnreadMessage = function (room_id, user_id, lastAccessTime) {
    return fetch(getConfig().api.chatroom + "/unreadMessage?room_id=" + room_id + "&user_id=" + user_id + "&lastAccessTime=" + lastAccessTime, {
        method: "GET",
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
};
exports.getOlderMessagesCount = function (room_id, topEdgeMessageTime, queryMessage) {
    return fetch(getConfig().api.chatroom + "/olderMessagesCount/?message=" + queryMessage + "&room_id=" + room_id + "&topEdgeMessageTime=" + topEdgeMessageTime, {
        method: "GET",
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
};
exports.getChatHistory = function (room_id, lastMessageTime, token) {
    return fetch(getConfig().api.chatroom + "/getChatHistory", {
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
exports.getPrivateChatroom = function (ownerId, roommateId) {
    return fetch("" + getConfig().api.chatroom, {
        method: "POST",
        headers: chitchatServiceUtils_1.chitchat_headers(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};
