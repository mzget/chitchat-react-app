"use strict";
exports.__esModule = true;
var React = require("react");
var List_1 = require("material-ui/List");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
exports.ProfileListView = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null, (props.item) ?
    React.createElement(List_1.List, null,
        React.createElement(List_1.ListItem, { onClick: function () { return props.onSelected(props.item); }, leftAvatar: (!!props.item.avatar) ?
                React.createElement(Avatar_1["default"], { src: props.item.avatar }) : React.createElement(Avatar_1["default"], null, props.item.username.charAt(0)), rightIcon: null, primaryText: React.createElement("span", null, props.item.username), secondaryText: React.createElement("p", null,
                React.createElement("span", null, props.item.email)) })) : null)); };
