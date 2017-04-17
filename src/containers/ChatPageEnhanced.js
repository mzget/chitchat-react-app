"use strict";
const React = require("react");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
const Chat_1 = require("./Chat");
exports.ChatPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }) => (React.createElement("div", null,
    React.createElement(Chat_1.ChatPage, { onError: onError, location: location, router: router }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
