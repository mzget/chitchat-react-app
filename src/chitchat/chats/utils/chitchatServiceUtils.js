"use strict";
const chitchatFactory_1 = require("../chitchatFactory");
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
exports.chitchat_headers = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().api.apiKey
});
exports.withToken = (headers) => (token) => {
    headers["x-access-token"] = token;
    return headers;
};
