import * as React from "react";
import { connect } from "react-redux";
import Flexbox from 'flexbox-react';
import * as Colors from "material-ui/styles/colors";
import Divider from "material-ui/Divider";
import * as teamRx from "../redux/team/teamRx";
import * as authRx from "../redux/authen/authRx";
import { TeamListBox } from "./teams/TeamListBox";
import { TeamsBox } from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";
class Team extends React.Component {
    componentWillMount() {
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        let { location, userReducer } = this.props;
        this.toolbar = (!!userReducer.user)
            ? userReducer.user.username : "Fail username";
    }
    componentWillReceiveProps(nextProps) {
        let { location, userReducer, authReducer, teamReducer } = nextProps;
        if (!userReducer.user || authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.history.replace("/");
        }
    }
    onSelectTeam(team) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.history.push(`/team/${team._id}`);
    }
    onToolbarMenuItem(id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    }
    render() {
        return (<Flexbox flexDirection="column" minHeight="100vh" style={{ backgroundColor: Colors.blueGrey50 }}>
                <Flexbox element="header">
                    <div style={{ width: "100%" }}>
                        <SimpleToolbar title={this.toolbar} menus={["logout"]} onSelectedMenuItem={this.onToolbarMenuItem}/>
                    </div>
                </Flexbox>
                <Flexbox flexDirection="row">
                    <Flexbox flexGrow={1}/>
                    <Flexbox flexDirection="column" justifyContent="center" flexGrow={1}>
                        <Flexbox style={{ justifyContent: "center", alignContent: "center" }}>
                            <p>Start with a team</p>
                        </Flexbox>
                        <Divider />
                        <TeamListBox teams={this.props.teamReducer.teams} onSelectTeam={this.onSelectTeam}/>
                        <Flexbox style={{ justifyContent: "center", alignContent: "center" }}>
                            <TeamsBox onError={this.props.onError}/>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox flexGrow={1}/>
                </Flexbox>
                <Flexbox flexGrow={1}/>
            </Flexbox>);
    }
}
function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        authReducer: state.authReducer,
        teamReducer: state.teamReducer
    };
}
export const TeamPage = connect(mapStateToProps)(Team);
