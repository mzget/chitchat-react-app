import * as React from "react";
import { connect } from "react-redux";
import { indigo500 } from "material-ui/styles/colors";
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { TeamCreateView } from "./TeamCreateView";
import { FindTeamView } from "./FindTeamView";
import { FindTeamListBox } from "./FindTeamListBox";
import * as TeamRx from "../../redux/team/teamRx";
var TeamBoxState;
(function (TeamBoxState) {
    TeamBoxState[TeamBoxState["idle"] = 0] = "idle";
    TeamBoxState[TeamBoxState["find"] = 1] = "find";
    TeamBoxState[TeamBoxState["create"] = 2] = "create";
})(TeamBoxState || (TeamBoxState = {}));
class TeamCreateBox extends React.Component {
    componentWillMount() {
        this.state = {
            team_name: "",
            teambox_state: TeamBoxState.idle
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
    onToggleView(state) {
        this.setState(previous => (Object.assign({}, previous, { teambox_state: state })));
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
    getView(boxState) {
        if (boxState == TeamBoxState.find) {
            return (<div>
                    <FindTeamView onSubmit={this.onFindTeamPress} onNameChange={this.onNameChange} team_name={this.state.team_name}/>
                    <FindTeamListBox findingTeams={this.props.teamReducer.findingTeams} onSelectTeam={this.onSelectTeam}/>
                </div>);
        }
        else if (boxState == TeamBoxState.create) {
            return <TeamCreateView team_name={this.state.team_name} onNameChange={this.onNameChange} onCreateTeam={this.onSubmitTeam}/>;
        }
    }
    render() {
        return (<div>
                <List>
                    <ListItem leftAvatar={<Avatar icon={<FontIcon className="material-icons">group </FontIcon>} backgroundColor={indigo500}/>} onClick={() => this.onToggleView(TeamBoxState.find)}>
                        Join an existing team
    </ListItem>
                    <ListItem leftAvatar={<Avatar icon={<FontIcon className="material-icons">group_add</FontIcon>} backgroundColor={indigo500}/>} onClick={() => this.onToggleView(TeamBoxState.create)}>
                        Create a new team
    </ListItem>
                </List>
                {this.getView(this.state.teambox_state)}
            </div>);
    }
}
const mapStateToProps = (state) => ({ teamReducer: state.teamReducer });
export const TeamsBox = connect(mapStateToProps)(TeamCreateBox);
