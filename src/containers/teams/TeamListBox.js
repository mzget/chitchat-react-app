"use strict";
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var RaisedButton_1 = require("material-ui/RaisedButton");
var style = {
    margin: 6
};
var TeamListView_1 = require("./TeamListView");
var IComponentNameProps = (function () {
    function IComponentNameProps() {
    }
    return IComponentNameProps;
}());
exports.TeamListBox = function (props) { return (React.createElement("div", null,
    React.createElement(Subheader_1["default"], null, "Your Teams"),
    React.createElement(TeamListView_1.TeamListView, { items: props.teams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton_1["default"], { label: "Enter", primary: true, style: style }) }))); };
