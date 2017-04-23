"use strict";
const React = require("react");
const Home_1 = require("./Home");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
exports.HomePageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }) => (React.createElement("div", null,
    React.createElement(Home_1.HomeWithState, { onError: onError, location: location, router: router }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
