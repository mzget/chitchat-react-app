"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const TeamListView_1 = require("./TeamListView");
class IComponentNameProps {
}
;
;
class TeamListBox extends React.Component {
    componentWillMount() {
        console.log("TeamList", this.props.teamReducer.teams);
        this.onSelectTeam = this.onSelectTeam.bind(this);
    }
    onSelectTeam(teamId) {
        console.log("onSelected team", teamId);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(TeamListView_1.TeamListView, { items: this.props.teamReducer.teams, onSelectItem: this.onSelectTeam })));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(TeamListBox);
