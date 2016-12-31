import * as React from 'react';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';

import BadgeSimple from "../components/BadgeSimple";
import { MessageImp } from "../chats/models/MessageImp";

const renderList = (props: { value: Array<MessageImp>, onSelected }) => (props.value.map((message, i) => {
    console.dir(message)
    return (
        <div key={i}>
            <ListItem
                onClick={() => props.onSelected(message)}
                leftAvatar={(!!message.user.avatar) ?
                    <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                }
                primaryText={message.body}
                secondaryText={
                    <p>
                        <span style={{ color: darkBlack }}>{message.createTime}</span>
                    </p>
                }
                />
            <Divider inset={true} />
        </div>)
})
);

const ListMessages = (props: { value: Array<MessageImp>, onSelected }) => (
    < MuiThemeProvider >
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);

export default ListMessages;