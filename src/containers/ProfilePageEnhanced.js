"use strict";
const React = require("react");
const Profile_1 = require("./Profile");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
exports.ProfilePageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }) => (React.createElement("div", null,
    React.createElement(Profile_1.ProfilePage, { onError: onError, location: location, router: router }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
