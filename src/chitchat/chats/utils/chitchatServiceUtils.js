"use strict";
var ChitchatFactory_1 = require("../ChitchatFactory");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
exports.chitchat_headers = function () { return ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().api.apiKey
}); };
exports.withToken = function (headers) { return function (token) {
    headers["x-access-token"] = token;
    return headers;
}; };
