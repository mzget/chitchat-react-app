"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Subheader_1 = require("material-ui/Subheader");
const colors_1 = require("material-ui/styles/colors");
const IconButton_1 = require("material-ui/IconButton");
const more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
const IconMenu_1 = require("material-ui/IconMenu");
const MenuItem_1 = require("material-ui/MenuItem");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const BadgeSimple_1 = require("../components/BadgeSimple");
const iconButtonElement = (React.createElement(IconButton_1.default, { touch: true, tooltip: "more", tooltipPosition: "bottom-left" },
    React.createElement(more_vert_1.default, { color: colors_1.grey400 })));
const rightIconMenu = (React.createElement(IconMenu_1.default, { iconButtonElement: iconButtonElement },
    React.createElement(MenuItem_1.default, null, "Reply"),
    React.createElement(MenuItem_1.default, null, "Forward"),
    React.createElement(MenuItem_1.default, null, "Delete")));
const renderList = (props) => (props.value.map((log, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: () => props.onSelected(log), leftAvatar: (!!log.room.image) ?
                React.createElement(Avatar_1.default, { src: log.room.image }) : React.createElement(Avatar_1.default, null, log.roomName.charAt(0)), rightIcon: React.createElement("div", { style: { marginRight: '40px', marginTop: 0 } }, (log.count && log.count != 0) ? React.createElement(BadgeSimple_1.default, { content: log.count }) : null), primaryText: log.roomName, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, log.lastMessage)) }),
        React.createElement(Divider_1.default, { inset: true })));
}));
const ListChatLogs = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null,
        React.createElement(Subheader_1.default, null, "Today"),
        (!!props.value) ? renderList(props) : null)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListChatLogs;
