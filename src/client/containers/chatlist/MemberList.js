"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const colors_1 = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const renderList = (props) => (props.value.map((item, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: () => props.onSelected(item), leftAvatar: (!!item.image) ?
                React.createElement(Avatar_1.default, { src: item.image }) : React.createElement(Avatar_1.default, null, item.username.charAt(0)), rightIcon: null, primaryText: item.username, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, item.email)) }),
        React.createElement(Divider_1.default, { inset: true })));
}));
exports.MemberList = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.value) ? renderList(props) : null)));
