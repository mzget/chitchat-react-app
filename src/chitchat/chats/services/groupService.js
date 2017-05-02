"use strict";
const Rx = require("rxjs");
const { ajax } = Rx.Observable;
const chitchatFactory_1 = require("../chitchatFactory");
const chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const authReducer = () => chitchatFactory_1.ChitChatFactory.getInstance().authStore;
function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
}
exports.addMember = addMember;
function removeMember(room_id, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/removeMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
}
exports.removeMember = removeMember;
