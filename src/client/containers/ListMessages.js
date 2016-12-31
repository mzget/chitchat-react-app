"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const colors_1 = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const renderList = (props) => (props.value.map((message, i) => {
    console.dir(message);
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: () => props.onSelected(message), leftAvatar: (!!message.user.avatar) ?
                React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), primaryText: message.body, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, message.createTime)) }),
        React.createElement(Divider_1.default, { inset: true })));
}));
const ListMessages = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.value) ? renderList(props) : null)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListMessages;
