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
const recompose_1 = require("recompose");
const DialogBox_1 = require("../components/DialogBox");
const Home_1 = require("./Home");
exports.DialogBoxEnhanced = recompose_1.compose(recompose_1.withState("title", "setTitle", "Alert!"), recompose_1.withState("message", "setMessage", ({ message }) => message), recompose_1.withState("open", "setOpen", false), recompose_1.withHandlers({
    onError: (props) => (error) => {
        props.setMessage(message => error);
        props.setOpen(open => true);
    },
    handleClose: (props) => () => {
        props.setMessage(message => "");
        props.setOpen(open => false);
    }
}), recompose_1.pure);
exports.HomeEnhancer = exports.DialogBoxEnhanced(({ title, message, open, handleClose, onError, location }) => (React.createElement("div", null,
    React.createElement(Home_1.HomeWithState, __assign({ onError: onError }, location)),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
