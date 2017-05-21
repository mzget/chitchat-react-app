import * as React from "react";
import { connect } from "react-redux";

import { TeamCreateView } from "./TeamCreateView";
import { FindTeamView } from "./FindTeamView";
import { FindTeamListBox } from "./FindTeamListBox";

import * as TeamRx from "../../redux/team/teamRx";
import { IComponentProps } from "../../utils/IComponentProps";
import { ITeam } from "../../chitchat/chats/models/ITeam";


interface IComponentNameState {
    team_name: string;
    is_FindTeam: boolean;
}

export class TeamCreateBox extends React.Component<IComponentProps, IComponentNameState> {
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
        this.setState(previous => ({ ...previous, team_name: text }));
    }

    onSubmitTeam() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
            this.setState(previous => ({ ...previous, team_name: "" }));
        }
        else {
            console.warn("Empty team name!");
            this.props.onError("Empty team name!");

        }
    }

    onToggleView() {
        this.setState(previous => ({ ...previous, is_FindTeam: !previous.is_FindTeam }));
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

    onSelectTeam(team: ITeam) {
        console.log("request to join team", team);
        this.props.dispatch(TeamRx.joinTeam(team.name));
    }

    public render(): JSX.Element {
        return (
            <div>
                {
                    (!this.state.is_FindTeam) ?
                        <TeamCreateView
                            team_name={this.state.team_name}
                            onNameChange={this.onNameChange}
                            onCreateTeam={this.onSubmitTeam}
                            onFindTeam={this.onToggleView}
                        />
                        :
                        <FindTeamView
                            onSubmit={this.onFindTeamPress}
                            onNameChange={this.onNameChange}
                            onCreateNewPress={this.onToggleView}
                            team_name={this.state.team_name}
                        />
                }
                <FindTeamListBox findingTeams={this.props.teamReducer.findingTeams} onSelectTeam={this.onSelectTeam} />
            </div>);
    }
}
