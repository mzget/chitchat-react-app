"use strict";
const React = require("react");
const Snackbar_1 = require("material-ui/Snackbar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
exports.SnackbarSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(Snackbar_1.default, { open: props.open, message: props.message, autoHideDuration: (props.hideDuration) ? props.hideDuration : 4000, onRequestClose: props.handleRequestClose }))));
