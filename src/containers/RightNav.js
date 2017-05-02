"use strict";
const React = require("react");
const ContactBox_1 = require("./chatlist/ContactBox");
const ChatRoomOverview_1 = require("./ChatRoomOverview");
const getView = (match, onError) => {
    if (match.path.match("/chatroom/")) {
        return React.createElement(ChatRoomOverview_1.ChatRoomOverview, { match: match, onError: onError });
    }
    else {
        return React.createElement(ContactBox_1.ContactBox, null);
    }
};
exports.RightNav = ({ match, onError }) => (React.createElement("div", null, getView(match, onError)));
