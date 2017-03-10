"use strict";
const React = require("react");
const Badge_1 = require("material-ui/Badge");
const notifications_1 = require("material-ui/svg-icons/social/notifications");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const BadgeSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(Badge_1.default, { badgeContent: props.content, badgeStyle: { backgroundColor: "red" }, secondary: true },
        React.createElement(notifications_1.default, null))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BadgeSimple;
