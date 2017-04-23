"use strict";
const React = require("react");
const ContactBox_1 = require("./chatlist/ContactBox");
const getView = (match) => {
    if (match.path.match("/chatroom/chat")) {
        return null;
    }
    else {
        return React.createElement(ContactBox_1.ContactBox, null);
    }
};
exports.RightNav = ({ match, onError }) => (React.createElement("div", null, getView(match)));
