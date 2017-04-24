"use strict";
const React = require("react");
const Colors = require("material-ui/styles/colors");
const RaisedButton_1 = require("material-ui/RaisedButton");
const reflexbox_1 = require("reflexbox");
exports.SubToolbar = ({ history, match, onError, chatroomReducer }) => (React.createElement("div", { style: { margin: 2, backgroundColor: Colors.indigo50 } },
    React.createElement(reflexbox_1.Flex, { flexColumn: false },
        React.createElement(RaisedButton_1.default, { label: "Manage Group", style: { margin: 2 } }),
        React.createElement(RaisedButton_1.default, { label: "Edit Group Settings", style: { margin: 2 }, onClick: () => {
                history.push(`/chatroom/settings/${chatroomReducer.room._id}/edit`);
            } }))));
