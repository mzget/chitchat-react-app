"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Avatar_1 = require("material-ui/Avatar");
exports.IncomingList = function (props) { return (<List_1.ListItem onClick={function () { return props.onSelected(props.message); }} leftAvatar={(!!props.message.user.avatar) ?
    <Avatar_1.default src={props.message.user.avatar}/> : <Avatar_1.default>{props.message.user.username.charAt(0)}</Avatar_1.default>} primaryText={props.message.body} secondaryText={<p>
                <span>{props.message.createTime}</span>
            </p>}/>); };
exports.OutComingList = function (props) { return (<List_1.ListItem onClick={function () { return props.onSelected(props.message); }} primaryText={props.message.body} secondaryText={<p>
                <span>{props.message.createTime}</span>
            </p>} style={{ textAlign: "right" }}/>); };
