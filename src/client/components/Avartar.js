"use strict";
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const List_1 = require("material-ui/List/List");
const ListItem_1 = require("material-ui/List/ListItem");
const style = { margin: 5 };
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
const AvatarExampleSimple = () => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(List_1.default, null,
            React.createElement(ListItem_1.default, { disabled: true, leftAvatar: React.createElement(Avatar_1.default, { src: "images/uxceo-128.jpg" }) }, "Image Avatar"),
            React.createElement(ListItem_1.default, { disabled: true, leftAvatar: React.createElement(Avatar_1.default, null, "A") }, "Letter Avatar")))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AvatarExampleSimple;
