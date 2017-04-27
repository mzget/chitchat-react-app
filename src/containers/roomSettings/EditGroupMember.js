"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Avatar_1 = require("material-ui/Avatar");
exports.EditGroupMember = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { flexColumn: true, align: "center" },
        React.createElement(List_1.List, { style: { width: "100%" } },
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map((item, i, arr) => {
                    return (React.createElement("div", { key: i },
                        React.createElement(List_1.ListItem, { leftAvatar: (!!item.avatar) ?
                                React.createElement(Avatar_1.default, { src: item.avatar, size: 30 }) :
                                (!!item.username) ?
                                    React.createElement(Avatar_1.default, { size: 30 }, item.username.charAt(0)) :
                                    null, primaryText: item.username }),
                        React.createElement(Divider_1.default, { inset: true })));
                }) : null),
        React.createElement(Divider_1.default, { inset: true }))));
