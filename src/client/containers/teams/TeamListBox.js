"use strict";
const React = require("react");
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
            React.createElement(TeamListView_1.TeamListView, { items: this.props.teamReducer.teams, onSelectItem: this.props.onSelectTeam })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamListBox;
