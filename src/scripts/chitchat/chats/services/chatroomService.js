import InternalStore, { withToken, apiHeaders, } from "stalk-simplechat";
const getConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;
export const getRoomInfo = (roomId) => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${roomId}`, {
        method: "GET",
        headers: withToken(apiHeaders())(authReducer().api_token),
    });
};
export const getUnreadMessage = (roomId, userId, lastAccessTime) => {
    return fetch(`${getConfig().chatroom}/unreadMessage?room_id=${roomId}&user_id=${userId}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: apiHeaders(),
    });
};
export const getOlderMessagesCount = (roomId, topEdgeMessageTime, queryMessage) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount/?message=${queryMessage}&room_id=${roomId}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: apiHeaders(),
    });
};
export const getChatHistory = (roomId, lastMessageTime, token) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            room_id: roomId,
            lastMessageTime,
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });
};
export const getPrivateChatroom = (ownerId, roommateId) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId,
            roommateId,
        }),
    });
};
