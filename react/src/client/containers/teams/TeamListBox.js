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
;
class TeamListBox extends React.Component {
    componentWillMount() {
        console.log("TeamList", this.props.teamReducer.teams);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Your Teams"),
            React.createElement(TeamListView_1.TeamListView, { items: this.props.teamReducer.teams, onSelectItem: this.props.onSelectTeam, actionChild: React.createElement(RaisedButton_1.default, { label: "Enter", primary: true, style: style }) })));
    }
}
exports.default = TeamListBox;
