import * as React from "react";
import * as Colors from "material-ui/styles/colors";
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Flex, Box } from "reflexbox";
import Subheader from 'material-ui/Subheader';

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import { Room, RoomType } from "../chitchat/libs/shared/Room";
import * as H from "history";

interface ISubToolbar {
    history, match, onError, chatroomReducer
}

const getView = (props: ISubToolbar) => {
    let { match, history, chatroomReducer } = props;
    let { room_id } = match.params;
    let { room }: { room: Room } = chatroomReducer;

    if (room_id && !room) {
        room = chatroomActions.getRoom(room_id);
    }

    if (match.path.match("/chatroom/") && room && room.type != RoomType.privateChat) {
        return (
            <div style={{ margin: 2, backgroundColor: Colors.indigo50 }}>
                <Flex flexColumn={false}>
                    <Subheader style={{ color: Colors.indigo500 }}>{room.name.toUpperCase()}</Subheader>
                    <Flex flexColumn>
                        {/*<span style={{ color: Colors.grey500 }}>{RoomType[room.type].toUpperCase()}</span>*/}
                    </Flex>
                    <Flex flex>
                    </Flex>
                    <FlatButton label="Manage Group" style={{ margin: 2 }} onClick={() => {
                        history.push(`/chatroom/settings/${room_id}/add_member`);
                    }} />
                    <FlatButton label="Edit Group Settings" style={{ margin: 2 }} onClick={() => {
                        history.push(`/chatroom/settings/${room_id}/edit`);
                    }} />
                </Flex>
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