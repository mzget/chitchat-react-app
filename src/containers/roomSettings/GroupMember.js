"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Avatar_1 = require("material-ui/Avatar");
exports.GroupMember = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { flexColumn: true, align: "center" },
        React.createElement(List_1.List, null,
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map((item, i, arr) => (React.createElement("div", { key: i },
                    (!!item.username) ? (React.createElement(List_1.ListItem, { leftAvatar: (!!item.avatar) ?
                            React.createElement(Avatar_1.default, { src: item.avatar }) : React.createElement(Avatar_1.default, null, item.username.charAt(0)), primaryText: (!!item.username) ? item.username : "Empty user name", secondaryText: React.createElement("p", null,
                            React.createElement("span", { style: { color: Colors.darkBlack } }, item.email)) })) : null,
                    React.createElement(Divider_1.default, { inset: true })))) : null),
        React.createElement(Divider_1.default, { inset: true }))));
