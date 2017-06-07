"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
var AvatarSimple = function (props) { return (<MuiThemeProvider_1.default>
        <div>
            {(!!props.src) ?
    <Avatar_1.default src={props.src}/> : <Avatar_1.default>{props.letter.charAt(0)}</Avatar_1.default>}
        </div>
    </MuiThemeProvider_1.default>); };
exports.__esModule = true;
exports["default"] = AvatarSimple;
