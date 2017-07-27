import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { grey400, darkBlack } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import BadgeSimple from "../../components/BadgeSimple";
const iconButtonElement = (<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400}/>
    </IconButton>);
const rightIconMenu = (log, onRemovedLog) => (<IconMenu iconButtonElement={iconButtonElement} onChange={(event, value) => {
    onRemovedLog(log);
}}>
        <MenuItem value="1" style={{ paddingLeft: "0", paddingRight: "0" }}>Delete</MenuItem>
    </IconMenu>);
const renderList = (props) => (props.value.map((log, i) => {
    return (<div key={i}>
                <ListItem leftAvatar={(!!log.room.image) ?
        <Avatar src={log.room.image}/> :
        <Avatar>{log.roomName.charAt(0)}</Avatar>} primaryText={<div>
                            {log.roomName}
                        </div>} secondaryText={<div>
                            <span style={{ color: darkBlack }}>{log.lastMessage}</span>
                        </div>} onClick={() => props.onSelected(log)} children={<div key={log.id} style={{ float: "right", position: "absolute", top: "10%", right: "2%", margin: "auto" }}>
                            {(log.count && log.count != 0) ? <BadgeSimple content={log.count}/> : null}
                            {rightIconMenu(log, props.onRemovedLog)}
                        </div>}/>
                <Divider inset={true}/>
            </div>);
}));
export const ListChatLogs = (props) => (<MuiThemeProvider>
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>);
