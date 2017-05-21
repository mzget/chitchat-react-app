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
const iconButtonElement = (React.createElement(IconButton, { touch: true, tooltip: "more", tooltipPosition: "bottom-left" },
    React.createElement(MoreVertIcon, { color: grey400 })));
const rightIconMenu = (log, onRemovedLog) => (React.createElement(IconMenu, { iconButtonElement: iconButtonElement, onChange: (event, value) => {
        onRemovedLog(log);
    } },
    React.createElement(MenuItem, { value: "1", style: { paddingLeft: "0", paddingRight: "0" } }, "Delete")));
const renderList = (props) => (props.value.map((log, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(ListItem, { leftAvatar: (!!log.room.image) ?
                React.createElement(Avatar, { src: log.room.image }) :
                React.createElement(Avatar, null, log.roomName.charAt(0)), primaryText: React.createElement("div", null, log.roomName), secondaryText: React.createElement("div", null,
                React.createElement("span", { style: { color: darkBlack } }, log.lastMessage)), onClick: () => props.onSelected(log), children: React.createElement("div", { key: log.id, style: { float: "right", position: "absolute", top: "10%", right: "2%", margin: "auto" } },
                (log.count && log.count != 0) ? React.createElement(BadgeSimple, { content: log.count }) : null,
                rightIconMenu(log, props.onRemovedLog)) }),
        React.createElement(Divider, { inset: true })));
}));
export const ListChatLogs = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(List, null, (!!props.value) ? renderList(props) : null)));
