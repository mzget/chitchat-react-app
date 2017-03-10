"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const RaisedButton_1 = require("material-ui/RaisedButton");
const style = {
    margin: 4,
};
const TeamListView_1 = require("./TeamListView");
;
exports.FindTeamListBox = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Find Team Results"),
    React.createElement(TeamListView_1.TeamListView, { items: props.findingTeams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton_1.default, { label: "Join", primary: true, style: style }) })));
