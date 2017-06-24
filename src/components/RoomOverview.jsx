import * as React from "react";
import Flexbox from "flexbox-react";
import { Avatar } from 'material-ui';
import { RoomType } from "../chitchat/chats/models/Room";
export const RoomHeader = ({ room }) => (<Flexbox flexDirection="row" alignItems="center">
        {(!!room && !!room.image)
    ? <Avatar src={room.image} size={32}/>
    : <Avatar>
                    {(!!room && !!room.name)
        ? room.name.charAt(0)
        : null}
                </Avatar>}
        <span style={{ marginLeft: 5 }}>GROUP NAME : {(!!room && !!room.name) ? room.name : ""}</span>
    </Flexbox>);
export const RoomOverview = ({ room }) => (<Flexbox flexDirection="column" style={{ overflowY: "scroll", overflowX: "hidden" }}>
        <Flexbox flexDirection="row">
            <p style={{ margin: 5 }}>TYPE : {RoomType[room.type].toUpperCase()}</p>
        </Flexbox>
        <Flexbox flexDirection="row">
            <p style={{ margin: 5 }}>DESCRIPTION : {room.description}</p>
        </Flexbox>
        <Flexbox flexDirection="row">
            <p style={{ margin: 5 }}>MEMBERS {room.members.length}</p>
        </Flexbox>
    </Flexbox>);
