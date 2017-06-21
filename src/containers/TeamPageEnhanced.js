"use strict";
exports.__esModule = true;
var React = require("react");
var Team_1 = require("./Team");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var DialogBox_1 = require("../components/DialogBox");
exports.TeamPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, location = _a.location, history = _a.history;
    return (React.createElement("div", null,
        React.createElement(Team_1.TeamPage, { onError: onError, location: location, history: history }),
        React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
});
