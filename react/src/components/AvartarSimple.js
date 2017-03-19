"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
const AvatarSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null, (!!props.src) ?
        React.createElement(Avatar_1.default, { src: props.src }) : React.createElement(Avatar_1.default, null, props.letter.charAt(0)))));
exports.default = AvatarSimple;
