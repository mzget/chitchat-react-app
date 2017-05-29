"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var actions = function (props) { return [
    React.createElement(FlatButton_1["default"], { label: "OK", primary: true, onMouseUp: props.handleClose }),
]; };
exports.DialogBox = function (props) {
    return (React.createElement(MuiThemeProvider_1["default"], null,
        React.createElement("div", null,
            React.createElement(Dialog_1["default"], { title: props.title, actions: actions(props), modal: true, open: props.open, onRequestClose: props.handleClose }, props.message))));
};
