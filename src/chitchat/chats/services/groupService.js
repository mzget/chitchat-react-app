"use strict";
exports.__esModule = true;
var Rx = require("rxjs");
var ajax = Rx.Observable.ajax;
var ChitchatFactory_1 = require("../ChitchatFactory");
var chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: getConfig().api.group + "/addMember/" + room_id,
        body: JSON.stringify({ member: member }),
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
}
exports.addMember = addMember;
function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: getConfig().api.group + "/removeMember/" + room_id,
        body: JSON.stringify({ member_id: member_id }),
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(authReducer().chitchat_token)
    });
}
exports.removeMember = removeMember;
