import { ChitChatFactory } from "../ChitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;

export const chitchat_headers = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().api.apiKey
});

export const withToken = (headers) => (token) => {
    headers["x-access-token"] = token;

    return headers;
};