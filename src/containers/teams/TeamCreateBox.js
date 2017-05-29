"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var TeamCreateView_1 = require("./TeamCreateView");
var FindTeamView_1 = require("./FindTeamView");
var FindTeamListBox_1 = require("./FindTeamListBox");
var TeamRx = require("../../redux/team/teamRx");
var TeamCreateBox = (function (_super) {
    __extends(TeamCreateBox, _super);
    function TeamCreateBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamCreateBox.prototype.componentWillMount = function () {
        this.state = {
            team_name: "",
            is_FindTeam: false
        };
        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmitTeam = this.onSubmitTeam.bind(this);
        this.onToggleView = this.onToggleView.bind(this);
        this.onFindTeamPress = this.onFindTeamPress.bind(this);
        this.onSelectTeam = this.onSelectTeam.bind(this);
    };
    TeamCreateBox.prototype.onNameChange = function (e, text) {
        this.setState(function (previous) { return (__assign({}, previous, { team_name: text })); });
    };
    TeamCreateBox.prototype.onSubmitTeam = function () {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
            this.setState(function (previous) { return (__assign({}, previous, { team_name: "" })); });
        }
        else {
            console.warn("Empty team name!");
            this.props.onError("Empty team name!");
        }
    };
    TeamCreateBox.prototype.onToggleView = function () {
        this.setState(function (previous) { return (__assign({}, previous, { is_FindTeam: !previous.is_FindTeam })); });
    };
    TeamCreateBox.prototype.onFindTeamPress = function () {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.findTeam(this.state.team_name));
        }
        else {
            console.warn("Empty team name!");
            this.props.onError("Empty team name!");
        }
    };
    TeamCreateBox.prototype.onSelectTeam = function (team) {
        console.log("request to join team", team);
        this.props.dispatch(TeamRx.joinTeam(team.name));
    };
    TeamCreateBox.prototype.render = function () {
        return (React.createElement("div", null,
            (!this.state.is_FindTeam) ?
                React.createElement(TeamCreateView_1.TeamCreateView, { team_name: this.state.team_name, onNameChange: this.onNameChange, onCreateTeam: this.onSubmitTeam, onFindTeam: this.onToggleView })
                :
                    React.createElement(FindTeamView_1.FindTeamView, { onSubmit: this.onFindTeamPress, onNameChange: this.onNameChange, onCreateNewPress: this.onToggleView, team_name: this.state.team_name }),
            React.createElement(FindTeamListBox_1.FindTeamListBox, { findingTeams: this.props.teamReducer.findingTeams, onSelectTeam: this.onSelectTeam })));
    };
    return TeamCreateBox;
}(React.Component));
exports.TeamCreateBox = TeamCreateBox;
