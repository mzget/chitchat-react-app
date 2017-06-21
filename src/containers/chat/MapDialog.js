"use strict";
exports.__esModule = true;
var React = require("react");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var MapBox_1 = require("./MapBox");
var actions = function (props) { return [
    React.createElement(FlatButton_1["default"], { label: "Cancel", primary: true, onTouchTap: props.onClose }),
    React.createElement(FlatButton_1["default"], { label: "Submit", primary: true, disabled: true, onTouchTap: props.onClose }),
]; };
exports.MapDialog = function (props) { return (React.createElement("div", null,
    React.createElement(Dialog_1["default"], { title: "Map Dialog", actions: actions(props), modal: true, open: props.open, contentStyle: {
            width: 480,
            height: 600
        } },
        React.createElement(MapBox_1.MapBox, null)))); };
