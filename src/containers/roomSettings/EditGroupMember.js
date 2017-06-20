"use strict";
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Avatar_1 = require("material-ui/Avatar");
exports.EditGroupMember = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(reflexbox_1.Flex, { flexColumn: true, align: "center" },
        React.createElement(List_1.List, { style: { width: "100%" } },
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map(function (item, i, arr) {
                    return (React.createElement("div", { key: i },
                        React.createElement(List_1.ListItem, { leftAvatar: (!!item.avatar) ?
                                React.createElement(Avatar_1["default"], { src: item.avatar, size: 30 }) :
                                (!!item.username) ?
                                    React.createElement(Avatar_1["default"], { size: 30 }, item.username.charAt(0)) :
                                    null, primaryText: item.username, rightIconButton: props.rightIconButton(item) }),
                        React.createElement(Divider_1["default"], { inset: true })));
                }) : null)))); };
