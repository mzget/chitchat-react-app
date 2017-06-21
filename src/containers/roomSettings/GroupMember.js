"use strict";
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Avatar_1 = require("material-ui/Avatar");
exports.GroupMember = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(reflexbox_1.Flex, { flexColumn: true, align: "center" },
        React.createElement(List_1.List, { style: { width: "100%" } },
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map(function (item, i, arr) { return (React.createElement("div", { key: i },
                    (!!item.username) ? (React.createElement(List_1.ListItem, { leftAvatar: (!!item.avatar) ?
                            React.createElement(Avatar_1["default"], { src: item.avatar }) : React.createElement(Avatar_1["default"], null, item.username.charAt(0)), primaryText: (!!item.username) ? item.username : "Empty user name", secondaryText: React.createElement("p", null,
                            React.createElement("span", { style: { color: Colors.darkBlack } }, item.email)) })) : null,
                    React.createElement(Divider_1["default"], { inset: true }))); }) : null),
        React.createElement(Divider_1["default"], { inset: true })))); };
