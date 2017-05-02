"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Avatar_1 = require("material-ui/Avatar");
const IconMenu_1 = require("material-ui/IconMenu");
const MenuItem_1 = require("material-ui/MenuItem");
const IconButton_1 = require("material-ui/IconButton");
const more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
const iconButtonElement = (React.createElement(IconButton_1.default, { touch: true, tooltip: "more", tooltipPosition: "bottom-left" },
    React.createElement(more_vert_1.default, { color: Colors.grey400 })));
const rightIconMenu = (React.createElement(IconMenu_1.default, { iconButtonElement: iconButtonElement },
    React.createElement(MenuItem_1.default, null, "Delete")));
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
                                    null, primaryText: item.username, rightIconButton: rightIconMenu }),
                        React.createElement(Divider_1.default, { inset: true })));
                }) : null),
        React.createElement(Divider_1.default, { inset: true }))));
