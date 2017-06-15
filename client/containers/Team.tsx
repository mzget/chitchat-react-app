import * as React from "react";
import { connect } from "react-redux";
import Flexbox from 'flexbox-react';

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { IComponentProps } from "../utils/IComponentProps";

import * as userRx from "../redux/user/userRx";
import * as teamRx from "../redux/team/teamRx";
import * as authRx from "../redux/authen/authRx";

import { DialogBox } from "../components/DialogBox";
import { TeamListBox } from "./teams/TeamListBox";
import { TeamCreateBox } from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { StalkCompEnhancer } from "./stalk/StalkComponent";

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
        let { location, userReducer, authReducer, teamReducer
        } = nextProps;

        if (teamReducer.error) {
            this.props.onError(teamReducer.error);
        }

        if (!userReducer.user ||
            authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.history.replace("/");
        }
    }

    onSelectTeam(team: ITeam) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.history.push(`/chatslist/${team.name}`);
    }

    onToolbarMenuItem(id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" minHeight="100vh">
                    <Flexbox element="header" >
                        <div style={{ width: "100%" }}>
                            <SimpleToolbar title={this.toolbar} menus={["logout"]} onSelectedMenuItem={this.onToolbarMenuItem} />
                        </div>
                    </Flexbox>
                    <Flexbox flexDirection="column" flexGrow={1}>
                        <TeamListBox teams={this.props.teamReducer.teams} onSelectTeam={this.onSelectTeam} />
                        <TeamCreateBox {...this.props} />
                    </Flexbox>
                    <Flexbox element="footer">
                        <StalkCompEnhancer />
                    </Flexbox>
                </Flexbox>
            </MuiThemeProvider>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return { ...state }; }
export const TeamPage = connect(mapStateToProps)(Team) as React.ComponentClass<any>;
