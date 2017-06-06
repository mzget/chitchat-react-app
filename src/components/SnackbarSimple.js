"use strict";
var React = require("react");
var Snackbar_1 = require("material-ui/Snackbar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
exports.SnackbarSimple = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", null,
        React.createElement(Snackbar_1["default"], { open: props.open, message: props.message, autoHideDuration: (props.hideDuration) ? props.hideDuration : 4000, onRequestClose: props.handleRequestClose })))); };