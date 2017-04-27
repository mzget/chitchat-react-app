"use strict";
const React = require("react");
const Colors = require("material-ui/styles/colors");
const FlatButton_1 = require("material-ui/FlatButton");
const reflexbox_1 = require("reflexbox");
const Subheader_1 = require("material-ui/Subheader");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const AlertMsg_1 = require("../chitchat/consts/AlertMsg");
const Room_1 = require("../chitchat/libs/shared/Room");
const UserRole_1 = require("../chitchat/chats/models/UserRole");
const checkAdminPermission = (teamProfile) => {
    let { team_role } = teamProfile;
    if (team_role.toString() == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
        return true;
    }
    else
        return false;
};
const getView = (props) => {
    let { match, history, onError, chatroomReducer, userReducer } = props;
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
                        if (room.type == Room_1.RoomType.organizationGroup) {
                            if (checkAdminPermission(userReducer.teamProfile)) {
                                history.push(`/chatroom/settings/${room_id}/add_member`);
                            }
                            else {
                                onError(AlertMsg_1.groups.request_admin_permission);
                            }
                        }
                        else {
                            history.push(`/chatroom/settings/${room_id}/add_member`);
                        }
                    } }),
                React.createElement(FlatButton_1.default, { label: "Edit Group Settings", style: { margin: 2 }, onClick: () => {
                        if (room.type == Room_1.RoomType.organizationGroup) {
                            if (checkAdminPermission(userReducer.teamProfile)) {
                                history.push(`/chatroom/settings/${room_id}/edit`);
                            }
                            else {
                                onError(AlertMsg_1.groups.request_admin_permission);
                            }
                        }
                        else {
                            history.push(`/chatroom/settings/${room_id}/edit`);
                        }
                    } }))));
    }
};
exports.SubToolbar = (props) => (React.createElement("div", null, getView(props)));
