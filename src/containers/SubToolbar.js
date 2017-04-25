"use strict";
const React = require("react");
const Colors = require("material-ui/styles/colors");
const RaisedButton_1 = require("material-ui/RaisedButton");
const reflexbox_1 = require("reflexbox");
const Room_1 = require("../chitchat/libs/shared/Room");
const getView = (props) => {
    let { match, history, chatroomReducer } = props;
    let { room_id } = match.params;
    let { room } = chatroomReducer;
    if (match.path.match("/chatroom/") && room.type != Room_1.RoomType.privateChat) {
        return (React.createElement("div", { style: { margin: 2, backgroundColor: Colors.indigo50 } },
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(RaisedButton_1.default, { label: "Manage Group", style: { margin: 2 }, onClick: () => {
                        console.log("room id", room_id);
                        history.push(`/chatroom/settings/${room_id}/add_member`);
                    } }),
                React.createElement(RaisedButton_1.default, { label: "Edit Group Settings", style: { margin: 2 }, onClick: () => {
                        console.log("room id", room_id);
                        history.push(`/chatroom/settings/${room_id}/edit`);
                    } }))));
    }
};
exports.SubToolbar = (props) => (React.createElement("div", null, getView(props)));
