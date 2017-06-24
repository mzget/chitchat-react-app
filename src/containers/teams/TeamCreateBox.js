import * as React from "react";
import { TeamCreateView } from "./TeamCreateView";
import { FindTeamView } from "./FindTeamView";
import { FindTeamListBox } from "./FindTeamListBox";
import * as TeamRx from "../../redux/team/teamRx";
export class TeamCreateBox extends React.Component {
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
        this.setState(previous => (Object.assign({}, previous, { team_name: text })));
    }
    onSubmitTeam() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
            this.setState(previous => (Object.assign({}, previous, { team_name: "" })));
        }
        else {
            console.warn("Empty team name!");
            this.props.onError("Empty team name!");
        }
    }
    onToggleView() {
        this.setState(previous => (Object.assign({}, previous, { is_FindTeam: !previous.is_FindTeam })));
    }
    onFindTeamPress() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.findTeam(this.state.team_name));
        }
        else {
            console.warn("Empty team name!");
            this.props.onError("Empty team name!");
        }
    }
    onSelectTeam(team) {
        console.log("request to join team", team);
        this.props.dispatch(TeamRx.joinTeam(team.name));
    }
    render() {
        return (React.createElement("div", null,
            (!this.state.is_FindTeam) ?
                React.createElement(TeamCreateView, { team_name: this.state.team_name, onNameChange: this.onNameChange, onCreateTeam: this.onSubmitTeam, onFindTeam: this.onToggleView })
                :
                    React.createElement(FindTeamView, { onSubmit: this.onFindTeamPress, onNameChange: this.onNameChange, onCreateNewPress: this.onToggleView, team_name: this.state.team_name }),
            React.createElement(FindTeamListBox, { findingTeams: this.props.teamReducer.findingTeams, onSelectTeam: this.onSelectTeam })));
    }
}
