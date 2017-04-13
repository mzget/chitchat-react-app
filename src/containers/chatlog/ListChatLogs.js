"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const colors_1 = require("material-ui/styles/colors");
const IconButton_1 = require("material-ui/IconButton");
const more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
const IconMenu_1 = require("material-ui/IconMenu");
const MenuItem_1 = require("material-ui/MenuItem");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const BadgeSimple_1 = require("../../components/BadgeSimple");
const iconButtonElement = (React.createElement(IconButton_1.default, { touch: true, tooltip: "more", tooltipPosition: "bottom-left" },
    React.createElement(more_vert_1.default, { color: colors_1.grey400 })));
const rightIconMenu = (log, onRemovedLog) => (React.createElement(IconMenu_1.default, { iconButtonElement: iconButtonElement, onChange: (event, value) => {
        onRemovedLog(log);
    } },
    React.createElement(MenuItem_1.default, { value: "1" }, "Delete")));
const renderList = (props) => (props.value.map((log, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { leftAvatar: (!!log.room.image) ?
                React.createElement(Avatar_1.default, { src: log.room.image }) :
                React.createElement(Avatar_1.default, null, log.roomName.charAt(0)), rightIconButton: rightIconMenu(log, props.onRemovedLog), rightIcon: React.createElement("div", null,
                React.createElement("div", { style: { marginRight: "40px", marginTop: 0 } }, (log.count && log.count != 0) ? React.createElement(BadgeSimple_1.default, { content: log.count }) : null)), primaryText: log.roomName, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, log.lastMessage)), onClick: () => props.onSelected(log) }),
        React.createElement(Divider_1.default, { inset: true })));
}));
exports.ListChatLogs = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.value) ? renderList(props) : null)));
