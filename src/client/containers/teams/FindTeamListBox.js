"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const TeamListView_1 = require("./TeamListView");
;
exports.FindTeamListBox = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Find Team Results"),
    React.createElement(TeamListView_1.TeamListView, { items: props.findingTeams, onSelectItem: props.onSelectTeam })));
