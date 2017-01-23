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
const TeamCreateView_1 = require("./TeamCreateView");
const TeamRx = require("../../redux/team/teamRx");
;
;
class TeamCreateBox extends React.Component {
    componentWillMount() {
        this.state = {
            team_name: ''
        };
        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmitTeam = this.onSubmitTeam.bind(this);
        this.onFindTeam = this.onFindTeam.bind(this);
    }
    onNameChange(e, text) {
        this.setState({ team_name: text });
    }
    onSubmitTeam() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
        }
        else {
            console.warn("Empty team name!");
        }
    }
    onFindTeam() {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(TeamCreateView_1.TeamCreateView, { team_name: this.state.team_name, onNameChange: this.onNameChange, onCreateTeam: this.onSubmitTeam, onFindTeam: this.onFindTeam })));
    }
}
const mapStateToProps = (state) => {
    return __assign({}, state);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(TeamCreateBox);
