import * as React from "react";
import { connect } from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import * as immutable from "immutable";

import { IComponentProps } from "../utils/IComponentProps";

import * as userRx from "../redux/user/userRx";
import * as teamRx from "../redux/team/teamRx";
import * as authRx from "../redux/authen/authRx";

import { DialogBox } from "../components/DialogBox";
import { TeamListBox } from "./teams/TeamListBox";
import TeamCreateBox from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";

import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import { ITeam } from "../chitchat/chats/models/ITeam";

interface IComponentNameState {
    openDialog: boolean;
}

/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component<IComponentProps, IComponentNameState> {

    toolbar: string;
    alertBoxMessage: string = "";
    alertBoxTitle: string = "";

    componentWillMount() {
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);

        let { location: { query: { userId, username, roomId, contactId } }, params, userReducer } = this.props;

        this.toolbar = "Teams";
        this.state = {
            openDialog: false
        };

        switch (userReducer.state) {
            case userRx.FETCH_USER_SUCCESS: {
                this.toolbar = (!!userReducer.user)
                    ? userReducer.user.username : "Fail username";

                if (!!userReducer.user.teams && userReducer.user.teams.length > 0) {
                    this.props.dispatch(teamRx.getTeamsInfo(userReducer.user.teams));
                }
                break;
            }
            case userRx.FETCH_USER_FAILURE: {
                this.alertBoxTitle = userRx.FETCH_USER_FAILURE;
                this.alertBoxMessage = userReducer.error;

                this.setState({ openDialog: true });
                break;
            }
            default: {
                break;
            }
        }
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { location: { query: { userId, username, roomId, contactId } },
            userReducer, authReducer, teamReducer
        } = nextProps;

        if (teamReducer.error) {
            this.alertBoxTitle = "Alert!";
            this.alertBoxMessage = teamReducer.error;
            this.setState(previous => ({ ...previous, openDialog: true }));
        }

        if (!userReducer.user ||
            authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.router.replace("/");
        }
    }

    onSelectTeam(team: ITeam) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.router.push(`/chatslist/${team.name}`);
    }

    onToolbarMenuItem(id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    }

    onCloseDialog() {
        this.alertBoxTitle = "";
        this.alertBoxMessage = "";

        this.setState(previous => ({ ...previous, openDialog: false }), () => {
            this.props.dispatch(teamRx.clearError());
        });
    }

    public render(): JSX.Element {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, teamReducer } = this.props;

        return (
            <MuiThemeProvider>
                <div>
                    <SimpleToolbar title={this.toolbar} menus={["logout"]} onSelectedMenuItem={this.onToolbarMenuItem} />
                    <TeamListBox teams={this.props.teamReducer.teams} onSelectTeam={this.onSelectTeam} />
                    <TeamCreateBox {...this.props} />
                    <DialogBox
                        title={this.alertBoxTitle}
                        message={this.alertBoxMessage}
                        open={this.state.openDialog}
                        handleClose={this.onCloseDialog}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return { ...state }; }
export default connect(mapStateToProps)(Team);
