"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Dialog_1 = require("material-ui/Dialog");
const FlatButton_1 = require("material-ui/FlatButton");
const LinearProgressSimple_1 = require("./LinearProgressSimple");
const actions = (props) => [
    React.createElement(FlatButton_1.default, { label: "OK", primary: true, onMouseUp: props.handleClose })
];
exports.LinearProgressDialog = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(Dialog_1.default, { title: props.title, actions: actions(props), modal: true, open: props.open, onRequestClose: props.handleClose },
                React.createElement(reflexbox_1.Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple_1.default, null))))));
};
