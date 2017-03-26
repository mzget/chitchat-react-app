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
const TeamCreateView_1 = require("./TeamCreateView");
const FindTeamView_1 = require("./FindTeamView");
const FindTeamListBox_1 = require("./FindTeamListBox");
const TeamRx = require("../../redux/team/teamRx");
;
class TeamCreateBox extends React.Component {
    componentWillMount() {
        this.state = {
            team_name: "",
            is_FindTeam: false
        };
        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmitTeam = this.onSubmitTeam.bind(this);
        this.onToggleView = this.onToggleView.bind(this);
        this.onFindTeamPress = this.onFindTeamPress.bind(this);
        this.onSelectTeam = this.onSelectTeam.bind(this);
    }
    onNameChange(e, text) {
        this.setState(previous => (__assign({}, previous, { team_name: text })));
    }
    onSubmitTeam() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
            this.setState(previous => (__assign({}, previous, { team_name: "" })));
        }
        else {
            console.warn("Empty team name!");
        }
    }
    onToggleView() {
        this.setState(previous => (__assign({}, previous, { is_FindTeam: !previous.is_FindTeam })));
    }
    onFindTeamPress() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.findTeam(this.state.team_name));
        }
        else {
            console.warn("Empty team name!");
        }
    }
    onSelectTeam(team) {
        console.log("request to join team", team);
        this.props.dispatch(TeamRx.joinTeam(team.name));
    }
    render() {
        return (React.createElement("div", null,
            (!this.state.is_FindTeam) ?
                React.createElement(TeamCreateView_1.TeamCreateView, { team_name: this.state.team_name, onNameChange: this.onNameChange, onCreateTeam: this.onSubmitTeam, onFindTeam: this.onToggleView })
                :
                    React.createElement(FindTeamView_1.FindTeamView, { onSubmit: this.onFindTeamPress, onNameChange: this.onNameChange, onCreateNewPress: this.onToggleView, team_name: this.state.team_name }),
            React.createElement(FindTeamListBox_1.FindTeamListBox, { findingTeams: this.props.teamReducer.findingTeams, onSelectTeam: this.onSelectTeam })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamCreateBox;
