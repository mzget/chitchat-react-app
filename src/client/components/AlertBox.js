"use strict";
const React = require("react");
const Dialog_1 = require("material-ui/Dialog");
const actions = (props) => [
    { label: "OK", onClick: props.onClose }
];
exports.AlertBox = (props) => (React.createElement("div", null,
    React.createElement(Dialog_1.default, { title: props.alertTitle, actions: actions(props), open: props.active, modal: true, onRequestClose: props.onClose }, props.alertMessage)));
