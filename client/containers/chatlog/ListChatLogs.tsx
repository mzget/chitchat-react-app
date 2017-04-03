import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";

import ChatLog from "../../chats/models/chatLog";
import BadgeSimple from "../../components/BadgeSimple";

interface IChatlogProps { value: Array<ChatLog>; onSelected: Function; onRemovedLog: (log: ChatLog) => void; }

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);

const rightIconMenu = (log: ChatLog, onRemovedLog: (log: ChatLog) => void) => (
    <IconMenu
        iconButtonElement={iconButtonElement}
        onChange={(event, value) => {
            onRemovedLog(log);
        }}
    >
        <MenuItem value="1">Delete</MenuItem>
    </IconMenu>
);

const renderList = (props: IChatlogProps) => (
    props.value.map((log, i) => {
        return (
            <div key={i}>
                <ListItem
                    leftAvatar={(!!log.room.image) ?
                        <Avatar src={log.room.image} /> :
                        <Avatar>{log.roomName.charAt(0)}</Avatar>
                    }
                    rightIconButton={rightIconMenu(log, props.onRemovedLog)}
                    rightIcon={
                        <div>
                            <div style={{ marginRight: "40px", marginTop: 0 }}>
                                {
                                    (log.count && log.count != 0) ? <BadgeSimple content={log.count} /> : null
                                }
                            </div>
                        </div>
                    }
                    primaryText={log.roomName}
                    secondaryText={
                        <p>
                            <span style={{ color: darkBlack }}>{log.lastMessage}</span>
                        </p>
                    }
                    onClick={() => props.onSelected(log)}
                />
                <Divider inset={true} />
            </div>);
    })
);

export const ListChatLogs = (props: IChatlogProps) => (
    < MuiThemeProvider >
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);