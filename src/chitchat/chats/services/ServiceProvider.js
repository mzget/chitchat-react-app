"use strict";
var Rx = require("rxjs/Rx");
var fetch = require("isomorphic-fetch");
var ChitchatFactory_1 = require("../ChitchatFactory");
var chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
function getLastAccessRoomInfo(team_id) {
    return fetch(getConfig().api.stalk_user + "/lastAccessRoom/?team_id=" + team_id, {
        method: "GET",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(authReducer().chitchat_token)
    });
}
exports.getLastAccessRoomInfo = getLastAccessRoomInfo;
function updateLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: getConfig().api.stalk_user + "/lastAccessRoom",
        method: "POST",
        headers: chitchatServiceUtils_1.chitchat_headers(),
        body: JSON.stringify({
            room_id: room_id,
            user_id: user_id
        })
    });
}
exports.updateLastAccessRoomInfo = updateLastAccessRoomInfo;
function removeLastAccessRoomInfo(user_id, room_id) {
    return Rx.Observable.ajax({
        url: getConfig().api.stalk_user + "/lastAccessRoom",
        method: "DELETE",
        headers: chitchatServiceUtils_1.chitchat_headers(),
        body: JSON.stringify({ room_id: room_id, user_id: user_id })
    });
}
exports.removeLastAccessRoomInfo = removeLastAccessRoomInfo;
