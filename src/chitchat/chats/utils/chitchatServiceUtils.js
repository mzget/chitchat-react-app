"use strict";
var chitchatFactory_1 = require("../chitchatFactory");
var getConfig = function () { return chitchatFactory_1.ChitChatFactory.getInstance().config; };
exports.chitchat_headers = function () { return ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().api.apiKey
}); };
exports.withToken = function (headers) { return function (token) {
    headers["x-access-token"] = token;
    return headers;
}; };
