"use strict";
exports.__esModule = true;
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var GroupList_1 = require("./GroupList");
exports.GroupListView = function (props) { return (React.createElement("div", null,
    React.createElement(Subheader_1["default"], null, props.subHeader),
    React.createElement(GroupList_1.GroupList, { values: props.groups, onSelected: props.onselectGroup }))); };
