"use strict";
const React = require("react");
const Team_1 = require("./Team");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
exports.TeamPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history }) => (React.createElement("div", null,
    React.createElement(Team_1.TeamPage, { onError: onError, location: location, history: history }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
