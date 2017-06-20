"use strict";
exports.__esModule = true;
var React = require("react");
var Badge_1 = require("material-ui/Badge");
var notifications_1 = require("material-ui/svg-icons/social/notifications");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var BadgeSimple = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(Badge_1["default"], { badgeContent: props.content, badgeStyle: { backgroundColor: "red" }, secondary: true, style: { paddingLeft: "0", paddingRight: "16px" } },
        React.createElement(notifications_1["default"], null)))); };
exports["default"] = BadgeSimple;
