"use strict";
const React = require("react");
const Admin_1 = require("./Admin");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
exports.AdminPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }) => (React.createElement("div", null,
    React.createElement(Admin_1.AdminPage, { onError: onError, location: location, router: router }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
