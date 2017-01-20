import * as React from "react";
import { connect } from "react-redux";

import { TeamCreateView } from './TeamCreateView';

import * as TeamRx from '../../redux/team/teamRx';

interface IComponentNameProps { };

interface IComponentNameState {
    team_name: string;
};

class TeamCreateBox extends React.Component<any, IComponentNameState> {
    componentWillMount() {
        this.state = {
            team_name: ''
        }

        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmitTeam = this.onSubmitTeam.bind(this);
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

    public render(): JSX.Element {
        return (<div>
            <TeamCreateView team_name={this.state.team_name} onNameChange={this.onNameChange} onSubmit={this.onSubmitTeam} />
        </div>);
    }
}


const mapStateToProps = (state) => {
    return {
        ...state
    }
}
export default connect(mapStateToProps)(TeamCreateBox);
