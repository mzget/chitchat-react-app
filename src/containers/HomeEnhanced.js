"use strict";
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const Home_1 = require("./Home");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const DialogBox_1 = require("../components/DialogBox");
exports.HomePageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, history }) => (React.createElement("div", null,
    React.createElement(Home_1.HomeWithState, { onError: onError, history: history }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
exports.HomePageWithDialogBox = react_router_dom_1.withRouter(exports.HomePageWithDialogBox);
