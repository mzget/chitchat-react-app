"use strict";
const React = require("react");
const Dialog_1 = require("material-ui/Dialog");
const FlatButton_1 = require("material-ui/FlatButton");
const RaisedButton_1 = require("material-ui/RaisedButton");
const actions = [
    React.createElement(FlatButton_1.default, { label: "Cancel", primary: true, onTouchTap: this.handleClose }),
    React.createElement(FlatButton_1.default, { label: "Submit", primary: true, disabled: true, onTouchTap: this.handleClose }),
];
/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
const UploadingDialog = (props) => (React.createElement("div", null,
    React.createElement(RaisedButton_1.default, { label: "Modal Dialog", onTouchTap: props.handleOpen }),
    React.createElement(Dialog_1.default, { title: "Uploading...", actions: actions, modal: true, open: props.openState }, "Only actions can close this dialog.")));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UploadingDialog;
