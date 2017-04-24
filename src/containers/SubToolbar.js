"use strict";
const React = require("react");
const FlatButton_1 = require("material-ui/FlatButton");
const reflexbox_1 = require("reflexbox");
exports.SubToolbar = ({ history, match, onError, chatroomReducer }) => (React.createElement("div", null,
    React.createElement(reflexbox_1.Flex, { flexColumn: false },
        React.createElement(FlatButton_1.default, { label: "Manage Group" }),
        React.createElement(FlatButton_1.default, { label: "Edit Group Settings", onClick: () => {
                history.push(`/chatroom/settings/${chatroomReducer.room._id}/edit`);
            } }))));
