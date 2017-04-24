"use strict";
const chitchatFactory_1 = require("../chitchatFactory");
const chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => chitchatFactory_1.ChitChatFactory.getInstance().authStore;
exports.getRoomInfo = (room_id) => {
    return fetch(`${getConfig().api.chatroom}/roomInfo?room_id=${room_id}`, {
        method: "GET",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(authReducer().chitchat_token)
    });
};
exports.getUnreadMessage = (room_id, user_id, lastAccessTime) => {
    return fetch(`${getConfig().api.chatroom}/unreadMessage?room_id=${room_id}&user_id=${user_id}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
};
exports.getOlderMessagesCount = (room_id, topEdgeMessageTime, queryMessage) => {
    return fetch(`${getConfig().api.chatroom}/olderMessagesCount/?message=${queryMessage}&room_id=${room_id}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
};
exports.getChatHistory = (room_id, lastMessageTime, token) => {
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
exports.getPrivateChatroom = (ownerId, roommateId) => {
    return fetch(`${getConfig().api.chatroom}`, {
        method: "POST",
        headers: chitchatServiceUtils_1.chitchat_headers(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId
        })
    });
};
