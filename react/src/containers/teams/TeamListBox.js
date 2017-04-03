"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const RaisedButton_1 = require("material-ui/RaisedButton");
const style = {
    margin: 6,
};
const TeamListView_1 = require("./TeamListView");
class IComponentNameProps {
}
;
exports.TeamListBox = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Your Teams"),
    React.createElement(TeamListView_1.TeamListView, { items: props.teams, onSelectItem: props.onSelectTeam, actionChild: React.createElement(RaisedButton_1.default, { label: "Enter", primary: true, style: style }) })));
