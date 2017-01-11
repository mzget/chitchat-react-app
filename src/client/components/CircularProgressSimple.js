"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const CircularProgress_1 = require("material-ui/CircularProgress");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const reflexbox_1 = require("reflexbox");
const CircularProgressSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", __assign({}, props),
        React.createElement(CircularProgress_1.default, { thickness: 7 }))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reflexbox_1.withReflex()(CircularProgressSimple);
