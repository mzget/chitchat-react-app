import * as React from "react";
import * as Colors from "material-ui/styles/colors";
import FlatButton from 'material-ui/FlatButton';
import Flexbox from "flexbox-react";
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import { groups } from "../chitchat/consts/AlertMsg";
import { RoomType } from "../chitchat/shared/Room";
import { UserRole } from "../chitchat/chats/models/UserRole";
const checkAdminPermission = (teamProfile) => {
    let { team_role } = teamProfile;
    if (team_role.toString() == UserRole[UserRole.admin]) {
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
    if (match.path.match("/chatroom/") && room) {
        return (React.createElement("div", { style: { margin: 2, backgroundColor: Colors.indigo50 } },
            React.createElement(Flexbox, { flexDirection: "row" },
                React.createElement(Avatar, { src: (room.image) ? room.image : (room.name) ? room.name.charAt(0) : null, style: { margin: 2 } }),
                React.createElement(Subheader, { style: { color: Colors.indigo500 } }, (room.name) ? room.name.toUpperCase() : null),
                (room.type != RoomType.privateChat) ? (React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement(FlatButton, { label: "Manage Group", style: { margin: 2 }, onClick: () => {
                            if (room.type == RoomType.organizationGroup) {
                                if (checkAdminPermission(userReducer.teamProfile)) {
                                    history.push(`/chatroom/settings/${room_id}/add_member`);
                                }
                                else {
                                    onError(groups.request_admin_permission);
                                }
                            }
                            else {
                                history.push(`/chatroom/settings/${room_id}/add_member`);
                            }
                        } }),
                    React.createElement(FlatButton, { label: "Edit Group Settings", style: { margin: 2 }, onClick: () => {
                            if (room.type == RoomType.organizationGroup) {
                                if (checkAdminPermission(userReducer.teamProfile)) {
                                    history.push(`/chatroom/settings/${room_id}/edit`);
                                }
                                else {
                                    onError(groups.request_admin_permission);
                                }
                            }
                            else {
                                history.push(`/chatroom/settings/${room_id}/edit`);
                            }
                        } }))) : null)));
    }
};
export const SubToolbar = (props) => (React.createElement("div", null, getView(props)));
