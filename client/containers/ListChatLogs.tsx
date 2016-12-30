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

import ChatLog from "../chats/models/chatLog";

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey400} />
    </IconButton>
);

const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Reply</MenuItem>
        <MenuItem>Forward</MenuItem>
        <MenuItem>Delete</MenuItem>
    </IconMenu>
);

const renderList = (props: { value: Array<ChatLog>, onSelected }) => (props.value.map((log, i) => {
    return (
        <div key={i}>
            <ListItem onTouchEnd={() => props.onSelected(log)} onMouseUp={() => props.onSelected(log)}
                leftAvatar={
                    (!!log.room.image) ?
                        <Avatar src={log.room.image} /> : <Avatar>{log.roomName.charAt(0)}</Avatar>
                }
                primaryText={log.roomName}
                secondaryText={
                    <p>
                        <span style={{ color: darkBlack }}>{log.lastMessage}</span>
                    </p>
                }
                secondaryTextLines={2}
                />
            <Divider inset={true} />
        </div>)
})
);

const ListChatLogs = (props: { value: Array<any>, onSelected }) => (
    < MuiThemeProvider >
        <List>
            <Subheader>Today</Subheader>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);

export default ListChatLogs;