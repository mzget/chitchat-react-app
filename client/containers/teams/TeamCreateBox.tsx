import * as React from "react";
import { connect } from "react-redux";

import { TeamCreateView } from './TeamCreateView';
import { FindTeamView } from './FindTeamView';

import * as TeamRx from '../../redux/team/teamRx';

interface IComponentNameProps { };

interface IComponentNameState {
    team_name: string;
    is_FindTeam: boolean;
};

class TeamCreateBox extends React.Component<any, IComponentNameState> {
    componentWillMount() {
        this.state = {
            team_name: '',
            is_FindTeam: false
        };

        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmitTeam = this.onSubmitTeam.bind(this);
        this.onToggleView = this.onToggleView.bind(this);
        this.onFindTeamPress = this.onFindTeamPress.bind(this);
    }

    onNameChange(e, text) {
        this.setState(previous => ({ ...previous, team_name: text }));
    }

    onSubmitTeam() {
        if (this.state.team_name.length > 0) {
            this.props.dispatch(TeamRx.createNewTeam(this.state.team_name));
        }
        else {
            console.warn("Empty team name!");
        }
    }

    onToggleView() {
        this.setState(previous => ({ ...previous, is_FindTeam: !previous.is_FindTeam }));
    }

    onFindTeamPress() {
        if (this.state.team_name.length > 0) {
        }
        else {
            console.warn("Empty team name!");
        }
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
            </div>);
    }
}

export default TeamCreateBox;
