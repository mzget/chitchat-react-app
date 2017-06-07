"use strict";
var React = require("react");
var AppBar_1 = require("material-ui/AppBar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
var AppBarIcon = function (props) { return (<MuiThemeProvider_1.default>
        <AppBar_1.default title={props.title} showMenuIconButton={false}/>
    </MuiThemeProvider_1.default>); };
exports.__esModule = true;
exports["default"] = AppBarIcon;
