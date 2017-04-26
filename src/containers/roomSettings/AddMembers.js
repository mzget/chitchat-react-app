"use strict";
const React = require("react");
const TextField_1 = require("material-ui/TextField");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
exports.AddMembers = () => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(TextField_1.default, { hintText: "Enter name or email address" })));
