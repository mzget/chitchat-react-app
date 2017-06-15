"use strict";
var React = require("react");
var AppBar_1 = require("material-ui/AppBar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
var AppBarIcon = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(AppBar_1["default"], { title: props.title, showMenuIconButton: false }))); };
exports.__esModule = true;
exports["default"] = AppBarIcon;
