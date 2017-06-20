"use strict";
exports.__esModule = true;
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
var AvatarSimple = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", null, (!!props.src) ?
        React.createElement(Avatar_1["default"], { src: props.src }) : React.createElement(Avatar_1["default"], null, props.letter.charAt(0))))); };
exports["default"] = AvatarSimple;
