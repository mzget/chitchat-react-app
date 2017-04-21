"use strict";
const React = require("react");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
const m_Chat_1 = require("./m_Chat");
exports.ChatPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router, params }) => (React.createElement("div", null,
    React.createElement(m_Chat_1.ChatPage, { onError: onError, location: location, router: router, params: params }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
