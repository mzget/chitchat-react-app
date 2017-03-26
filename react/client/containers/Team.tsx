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
import TeamListBox from "./teams/TeamListBox";
import TeamCreateBox from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";

import * as StalkBridgeActions from "../chats/redux/stalkBridge/stalkBridgeActions";
import { ITeam } from "../chats/models/ITeam";

interface IComponentNameState {
    openDialog: boolean;
};

/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component<IComponentProps, IComponentNameState> {

    toolbar: string;
    alertBoxMessage: string = "";
    alertBoxTitle: string = "";

    componentWillMount() {
        console.log("Main", this.props);

        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);

        let { location: { query: { userId, username, roomId, contactId } }, params, userReducer } = this.props;

        this.toolbar = "Teams";
        this.state = {
            openDialog: false
        };

        if (params.filter) {
            this.props.dispatch(userRx.fetchUser(params.filter));
        }
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { location: { query: { userId, username, roomId, contactId } },
            userReducer, authReducer, teamReducer
        } = nextProps;

        switch (userReducer.state) {
            case userRx.FETCH_USER_SUCCESS: {
                this.toolbar = (!!userReducer.user)
                    ? userReducer.user.username : "Fail username";

                if (!!this.props.userReducer.user) {
                    let nextRed = immutable.fromJS(userReducer);
                    let red = immutable.fromJS(this.props.userReducer);
                    if (!red.equals(nextRed)) {
                        this.props.dispatch(teamRx.getTeamsInfo(userReducer.user.teams));
                    }
                }
                else {
                    if (!!userReducer.user.teams && userReducer.user.teams.length > 0) {
                        this.props.dispatch(teamRx.getTeamsInfo(userReducer.user.teams));
                    }
                }
                break;
            }
            case userRx.FETCH_USER_FAILURE: {
                this.props.router.push(`/`);
                break;
            }
            default: {
                if (!userReducer.user) {
                    this.props.router.push(`/`);
                }
                break;
            }
        }

        switch (teamReducer.state) {
            case teamRx.CREATE_TEAM_FAILURE: {
                this.alertBoxTitle = teamRx.CREATE_TEAM_FAILURE;
                this.alertBoxMessage = teamReducer.error;
                this.setState(previous => ({ ...previous, openDialog: true }));
                break;
            }
            default:
                break;
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
                    <TeamListBox {...this.props} onSelectTeam={this.onSelectTeam} />
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
function mapStateToProps(state) {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(Team);
