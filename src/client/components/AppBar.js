"use strict";
const React = require("react");
const AppBar_1 = require("material-ui/AppBar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const AppBarIcon = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(AppBar_1.default, { title: props.title, showMenuIconButton: false })));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppBarIcon;
