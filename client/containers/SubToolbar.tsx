import * as React from "react";
import * as Colors from "material-ui/styles/colors";
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Flexbox from "flexbox-react";
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import { groups } from "../chitchat/consts/AlertMsg";
import { Room, RoomType } from "../chitchat/chats/models/Room";
import { ITeamProfile } from "../chitchat/chats/models/TeamProfile";
import { UserRole } from "../chitchat/chats/models/UserRole";

import * as H from "history";

interface ISubToolbar {
    history, match, onError, chatroomReducer, userReducer
}

const checkAdminPermission = (teamProfile: ITeamProfile) => {
    let { team_role } = teamProfile;

    if (team_role.toString() == UserRole[UserRole.admin]) {
        return true;
    }
    else
        return false;
}

const getView = (props: ISubToolbar) => {
    let { match, history, onError, chatroomReducer, userReducer } = props;
    let { room_id } = match.params;
    let { room }: { room: Room } = chatroomReducer;

    if (room_id && !room) {
        room = chatroomActions.getRoom(room_id);
    }

    if (match.path.match("/chatroom/") && room) {
        return (
            <div style={{ margin: 2, backgroundColor: Colors.blueGrey50 }}>
                <Flexbox flexDirection="row">
                    <Avatar src={(room.image) ? room.image : (room.name) ? room.name.charAt(0) : null} style={{ margin: 2 }} />
                    <Subheader style={{ color: Colors.indigo500 }}>{(room.name) ? room.name.toUpperCase() : null}</Subheader>

                    {
                        (room.type != RoomType.privateChat) ? (
                            <Flexbox flexDirection="row">
                                <FlatButton label="Manage Group" style={{ margin: 2 }} onClick={() => {
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
                                }} />
                                <FlatButton label="Edit Group Settings" style={{ margin: 2 }} onClick={() => {
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
                                }
                                } />
                            </Flexbox>
                        ) : null
                    }
                </Flexbox>
            </div>
        );
    }
}
export const SubToolbar = (props: ISubToolbar) => (
    <div>
        {
            getView(props)
        }
    </div>
);