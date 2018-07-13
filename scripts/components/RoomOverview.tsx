import * as React from "react";
import Flexbox from "flexbox-react";
import { Avatar } from 'material-ui';
import Subheader from 'material-ui/Subheader';
import { darkBlack } from 'material-ui/styles/colors';

import { Room, RoomType } from "../chitchat/chats/models/Room";

export const RoomHeader = ({ room }) => (
    <Flexbox flexDirection="row" alignItems="center" padding={"4"}>
        {
            (!!room && !!room.image)
                ? <Avatar src={room.image} size={32} />
                : <Avatar>
                    {
                        (!!room && !!room.name)
                            ? room.name.charAt(0)
                            : null
                    }
                </Avatar>
        }
        <span style={{ marginLeft: 5 }}>GROUP NAME : {(!!room && !!room.name) ? room.name : ""}</span>
    </Flexbox>
);

export const RoomOverview = ({ room }) => (
    <Flexbox flexDirection="column">
        <Flexbox flexDirection="row">
            <Subheader style={{ marginLeft: 5, color: darkBlack }}>TYPE : {RoomType[room.type].toUpperCase()}</Subheader>
        </Flexbox>
        <Flexbox flexDirection="row">
            <Subheader style={{ marginLeft: 5, color: darkBlack }}>DESCRIPTION : {room.description}</Subheader>
        </Flexbox>
        <Flexbox flexDirection="row">
            <Subheader style={{ marginLeft: 5, color: darkBlack }}>MEMBERS {(!!room.members) ? room.members.length : 0}</Subheader>
        </Flexbox>
    </Flexbox>
);