"use strict";
const React = require("react");
const ContactBox_1 = require("./chatlist/ContactBox");
const ChatRoomSettings_1 = require("./ChatRoomSettings");
const getView = (match, onError) => {
    if (match.path.match("/chatroom/")) {
        return React.createElement(ChatRoomSettings_1.ChatRoomSettingsPage, { match: match, onError: onError });
    }
    else {
        return React.createElement(ContactBox_1.ContactBox, null);
    }
};
exports.RightNav = ({ match, onError }) => (React.createElement("div", null, getView(match, onError)));
