"use strict";
var Rx = require("rxjs");
var ChitchatFactory_1 = require("../ChitchatFactory");
var chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
var ajax = Rx.Observable.ajax;
function updateMessageReader(message_id, room_id) {
    return Rx.Observable.ajax({
        url: getConfig().api.message + "/updateReader",
        method: "POST",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(authReducer().chitchat_token),
        body: JSON.stringify({ room_id: room_id, message_id: message_id })
    });
}
exports.updateMessageReader = updateMessageReader;
