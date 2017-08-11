import * as React from "react";
import { connect } from "react-redux";
import Flexbox from 'flexbox-react';

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Divider from "material-ui/Divider";

import { IComponentProps } from "../utils/IComponentProps";

import * as userRx from "../redux/user/userRx";
import * as teamRx from "../redux/team/teamRx";
import * as authRx from "../redux/authen/authRx";

import { DialogBox } from "../components/DialogBox";
import { TeamListBox } from "./teams/TeamListBox";
import { TeamsBox } from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";

import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import { ITeam } from "../chitchat/chats/models/ITeam";

/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component<IComponentProps, any> {

    toolbar: string;

    componentWillMount() {
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);

        let { location, userReducer } = this.props;

        this.toolbar = (!!userReducer.user)
            ? userReducer.user.username : "Fail username";
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { location, userReducer, authReducer, teamReducer } = nextProps;

        if (!userReducer.user || authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.history.replace("/");
        }
    }

    onSelectTeam(team: ITeam) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.history.push(`/team/${team._id}`);
    }

    onToolbarMenuItem(id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" minHeight="100vh" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <Flexbox element="header" >
                        <div style={{ width: "100%" }}>
                            <SimpleToolbar title={this.toolbar} menus={["logout"]} onSelectedMenuItem={this.onToolbarMenuItem} />
                        </div>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <Flexbox flexGrow={1} />
                        <Flexbox flexDirection="column" justifyContent="center" flexGrow={1} >
                            <Flexbox style={{ justifyContent: "center", alignContent: "center" }}>
                                <p>Start with a team</p>
                            </Flexbox>
                            <Divider />
                            <TeamListBox teams={this.props.teamReducer.teams} onSelectTeam={this.onSelectTeam} />
                            <Flexbox style={{ justifyContent: "center", alignContent: "center" }}>
                                <TeamsBox onError={this.props.onError} />
                            </Flexbox>
                        </Flexbox>
                        <Flexbox flexGrow={1} />
                    </Flexbox>
                    <Flexbox flexGrow={1} />
                </Flexbox>
            </MuiThemeProvider>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        authReducer: state.authReducer,
        teamReducer: state.teamReducer
    };
}
export const TeamPage = connect(mapStateToProps)(Team) as React.ComponentClass<any>;
