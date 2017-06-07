"use strict";
var React = require("react");
var Badge_1 = require("material-ui/Badge");
var notifications_1 = require("material-ui/svg-icons/social/notifications");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var BadgeSimple = function (props) { return (<MuiThemeProvider_1.default>
        <Badge_1.default badgeContent={props.content} badgeStyle={{ backgroundColor: "red" }} secondary={true} style={{ paddingLeft: "0", paddingRight: "16px" }}>
            <notifications_1.default />
        </Badge_1.default>
    </MuiThemeProvider_1.default>); };
exports.__esModule = true;
exports["default"] = BadgeSimple;
