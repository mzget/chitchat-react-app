"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const colors_1 = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
exports.ProfileListView = (props) => (React.createElement(MuiThemeProvider_1.default, null, (props.item) ?
    React.createElement(List_1.List, null,
        React.createElement(List_1.ListItem, { onClick: () => props.onSelected(props.item), leftAvatar: (!!props.item.avatar) ?
                React.createElement(Avatar_1.default, { src: props.item.avatar }) : React.createElement(Avatar_1.default, null, props.item.username.charAt(0)), rightIcon: null, primaryText: props.item.username, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, props.item.email)) }),
        React.createElement(Divider_1.default, { inset: true }))
    : null));
