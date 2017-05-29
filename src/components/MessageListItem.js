"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Avatar_1 = require("material-ui/Avatar");
exports.IncomingList = function (props) { return (React.createElement(List_1.ListItem, { onClick: function () { return props.onSelected(props.message); }, leftAvatar: (!!props.message.user.avatar) ?
        React.createElement(Avatar_1["default"], { src: props.message.user.avatar }) : React.createElement(Avatar_1["default"], null, props.message.user.username.charAt(0)), primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)) })); };
exports.OutComingList = function (props) { return (React.createElement(List_1.ListItem, { onClick: function () { return props.onSelected(props.message); }, primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)), style: { textAlign: "right" } })); };
