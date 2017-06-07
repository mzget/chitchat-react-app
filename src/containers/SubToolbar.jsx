"use strict";
var React = require("react");
var Colors = require("material-ui/styles/colors");
var FlatButton_1 = require("material-ui/FlatButton");
var reflexbox_1 = require("reflexbox");
var Subheader_1 = require("material-ui/Subheader");
var chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
var AlertMsg_1 = require("../chitchat/consts/AlertMsg");
var Room_1 = require("../chitchat/shared/Room");
var UserRole_1 = require("../chitchat/chats/models/UserRole");
var checkAdminPermission = function (teamProfile) {
    var team_role = teamProfile.team_role;
    if (team_role.toString() == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
        return true;
    }
    else
        return false;
};
var getView = function (props) {
    var match = props.match, history = props.history, onError = props.onError, chatroomReducer = props.chatroomReducer, userReducer = props.userReducer;
    var room_id = match.params.room_id;
    var room = chatroomReducer.room;
    if (room_id && !room) {
        room = chatroomActions.getRoom(room_id);
    }
    if (match.path.match("/chatroom/") && room && room.type != Room_1.RoomType.privateChat) {
        return (<div style={{ margin: 2, backgroundColor: Colors.indigo50 }}>
                <reflexbox_1.Flex flexColumn={false}>
                    <Subheader_1.default style={{ color: Colors.indigo500 }}>{room.name.toUpperCase()}</Subheader_1.default>
                    <reflexbox_1.Flex flexColumn>
                        
                    </reflexbox_1.Flex>
                    <reflexbox_1.Flex flex>
                    </reflexbox_1.Flex>
                    <FlatButton_1.default label="Manage Group" style={{ margin: 2 }} onClick={function () {
            if (room.type == Room_1.RoomType.organizationGroup) {
                if (checkAdminPermission(userReducer.teamProfile)) {
                    history.push("/chatroom/settings/" + room_id + "/add_member");
                }
                else {
                    onError(AlertMsg_1.groups.request_admin_permission);
                }
            }
            else {
                history.push("/chatroom/settings/" + room_id + "/add_member");
            }
        }}/>
                    <FlatButton_1.default label="Edit Group Settings" style={{ margin: 2 }} onClick={function () {
            if (room.type == Room_1.RoomType.organizationGroup) {
                if (checkAdminPermission(userReducer.teamProfile)) {
                    history.push("/chatroom/settings/" + room_id + "/edit");
                }
                else {
                    onError(AlertMsg_1.groups.request_admin_permission);
                }
            }
            else {
                history.push("/chatroom/settings/" + room_id + "/edit");
            }
        }}/>
                </reflexbox_1.Flex>
            </div>);
    }
};
exports.SubToolbar = function (props) { return (<div>
        {getView(props)}
    </div>); };
