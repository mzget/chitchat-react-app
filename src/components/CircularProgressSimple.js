"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var CircularProgress_1 = require("material-ui/CircularProgress");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var reflexbox_1 = require("reflexbox");
var CircularProgressSimple = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", __assign({}, props),
        React.createElement(CircularProgress_1["default"], { thickness: 7 })))); };
exports.__esModule = true;
exports["default"] = reflexbox_1.withReflex()(CircularProgressSimple);
