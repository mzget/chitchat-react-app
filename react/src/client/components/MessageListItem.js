"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Avatar_1 = require("material-ui/Avatar");
exports.IncomingList = (props) => (React.createElement(List_1.ListItem, { onClick: () => props.onSelected(props.message), leftAvatar: (!!props.message.user.avatar) ?
        React.createElement(Avatar_1.default, { src: props.message.user.avatar }) : React.createElement(Avatar_1.default, null, props.message.user.username.charAt(0)), primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)) }));
exports.OutComingList = (props) => (React.createElement(List_1.ListItem, { onClick: () => props.onSelected(props.message), primaryText: props.message.body, secondaryText: React.createElement("p", null,
        React.createElement("span", null, props.message.createTime)), style: { textAlign: 'right' } }));
