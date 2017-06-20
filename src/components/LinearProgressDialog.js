"use strict";
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var LinearProgressSimple_1 = require("./LinearProgressSimple");
var actions = function (props) { return [
    React.createElement(FlatButton_1["default"], { label: "OK", primary: true, onMouseUp: props.handleClose })
]; };
exports.LinearProgressDialog = function (props) {
    return (React.createElement(MuiThemeProvider_1["default"], null,
        React.createElement("div", null,
            React.createElement(Dialog_1["default"], { title: props.title, actions: actions(props), modal: true, open: props.open, onRequestClose: props.handleClose },
                React.createElement(reflexbox_1.Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple_1["default"], null))))));
};
