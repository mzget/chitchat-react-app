import * as React from 'react';

import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { MessageImp } from "../chats/models/MessageImp";
import BadgeSimple from "../components/BadgeSimple";

export const IncomingList = (props: { message: MessageImp, onSelected: (item) => void }) => (
    <ListItem
        onClick={() => props.onSelected(props.message)}
        leftAvatar={(!!props.message.user.avatar) ?
            <Avatar src={props.message.user.avatar} /> : <Avatar>{props.message.user.username.charAt(0)}</Avatar>
        }
        primaryText={props.message.body}
        secondaryText={
            <p >
                <span>{props.message.createTime}</span>
            </p >
        }
        />
);

export const OutComingList = (props: { message: MessageImp, onSelected: (item) => void }) => (
    <ListItem
        onClick={() => props.onSelected(props.message)}
        primaryText={props.message.body}
        secondaryText={
            <p >
                <span>{props.message.createTime}</span>
            </p >
        }
        style={{ textAlign: 'right' }}
        />
);