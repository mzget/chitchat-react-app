"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CircularProgress_1 = require("material-ui/CircularProgress");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const reflexbox_1 = require("reflexbox");
const CircularProgressSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", Object.assign({}, props),
        React.createElement(CircularProgress_1.default, { thickness: 7 }))));
exports.default = reflexbox_1.withReflex()(CircularProgressSimple);
