import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";

import ChatLog from "../../chitchat/chats/models/chatLog";
import BadgeSimple from "../../components/BadgeSimple";
// import { ChatlogItem } from "../../components/ChatlogItem";

interface IChatlogProps {
    value: ChatLog[];
    onSelected: () => void;
    onRemovedLog: (log: ChatLog) => void;
}

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
        <MenuItem value="1" style={{ paddingLeft: "0", paddingRight: "0" }}>Delete</MenuItem>
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
                    primaryText={
                        <div>
                            {log.roomName}
                        </div>
                    }
                    secondaryText={
                        <div>
                            <span style={{ color: darkBlack }}>{log.lastMessage}</span>
                        </div>
                    }
                    onClick={() => props.onSelected(log)}
                    children={
                        <div key={log.id}
                            style={{ float: "right", position: "absolute", top: "10%", right: "2%", margin: "auto" }}>
                            {
                                (log.count && log.count !== 0) ? <BadgeSimple content={log.count} /> : null
                            }
                            {
                                rightIconMenu(log, props.onRemovedLog)
                            }
                        </div>
                    }
                />
                <Divider inset={true} />
            </div>);
    })
);

export const ListChatLogs = (props: IChatlogProps) => (
    <MuiThemeProvider>
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>
);
