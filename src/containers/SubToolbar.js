"use strict";
const React = require("react");
const Colors = require("material-ui/styles/colors");
const FlatButton_1 = require("material-ui/FlatButton");
const reflexbox_1 = require("reflexbox");
const Subheader_1 = require("material-ui/Subheader");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const Room_1 = require("../chitchat/libs/shared/Room");
const getView = (props) => {
    let { match, history, chatroomReducer } = props;
    let { room_id } = match.params;
    let { room } = chatroomReducer;
    if (room_id && !room) {
        room = chatroomActions.getRoom(room_id);
    }
    if (match.path.match("/chatroom/") && room && room.type != Room_1.RoomType.privateChat) {
        return (React.createElement("div", { style: { margin: 2, backgroundColor: Colors.indigo50 } },
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(Subheader_1.default, { style: { color: Colors.indigo500 } }, room.name.toUpperCase()),
                React.createElement(reflexbox_1.Flex, { flexColumn: true }),
                React.createElement(reflexbox_1.Flex, { flex: true }),
                React.createElement(FlatButton_1.default, { label: "Manage Group", style: { margin: 2 }, onClick: () => {
                        history.push(`/chatroom/settings/${room_id}/add_member`);
                    } }),
                React.createElement(FlatButton_1.default, { label: "Edit Group Settings", style: { margin: 2 }, onClick: () => {
                        history.push(`/chatroom/settings/${room_id}/edit`);
                    } }))));
    }
};
exports.SubToolbar = (props) => (React.createElement("div", null, getView(props)));
