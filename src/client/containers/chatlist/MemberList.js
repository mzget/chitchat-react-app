"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const colors_1 = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const Toggle_1 = require("material-ui/Toggle");
const renderList = (props) => props.items.map((item, i) => React.createElement("div", { key: i },
    React.createElement(List_1.ListItem, { onClick: (!!props.onSelected) ? () => props.onSelected(item) : () => { }, leftAvatar: (!!item.avatar) ?
            React.createElement(Avatar_1.default, { src: item.avatar }) : React.createElement(Avatar_1.default, null, item.username.charAt(0)), rightIcon: (props.rightIcon) ? props.rightIcon : null, rightToggle: (props.rightToggle) ?
            React.createElement(Toggle_1.default, { onToggle: (event, isInputChecked) => {
                    props.onToggleItem(item, isInputChecked);
                }, disabled: true, defaultToggled: true }) : null, primaryText: item.username, secondaryText: React.createElement("p", null,
            React.createElement("span", { style: { color: colors_1.darkBlack } }, item.email)) }),
    React.createElement(Divider_1.default, { inset: true })));
exports.MemberList = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null)));
