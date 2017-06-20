"use strict";
exports.__esModule = true;
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var RaisedButton_1 = require("material-ui/RaisedButton");
var style = {
    margin: 4
};
var TeamListView_1 = require("./TeamListView");
exports.FindTeamListBox = function (props) { return (React.createElement("div", null,
    React.createElement(Subheader_1["default"], null, "Find Team Results"),
    React.createElement(TeamListView_1.TeamListView, { items: props.findingTeams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton_1["default"], { label: "Join", primary: true, style: style }) }))); };
