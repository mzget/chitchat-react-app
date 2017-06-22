import * as React from "react";
import { connect } from "react-redux";
import Flexbox from 'flexbox-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import * as teamRx from "../redux/team/teamRx";
import * as authRx from "../redux/authen/authRx";
import { TeamListBox } from "./teams/TeamListBox";
import { TeamCreateBox } from "./teams/TeamCreateBox";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
/**
 * Containers of chatlist, chatlogs, etc...
 */
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
        if (teamReducer.error) {
            this.props.onError(teamReducer.error);
        }
        if (!userReducer.user ||
            authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.history.replace("/");
        }
    }
    onSelectTeam(team) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.history.push(`/chatslist/${team.name}`);
    }
    onToolbarMenuItem(id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider, null,
            React.createElement(Flexbox, { flexDirection: "column", minHeight: "100vh", style: { backgroundColor: Colors.blueGrey50 } },
                React.createElement(Flexbox, { element: "header" },
                    React.createElement("div", { style: { width: "100%" } },
                        React.createElement(SimpleToolbar, { title: this.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }))),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(Flexbox, { flexDirection: "column", justifyContent: "center", flexGrow: 1 },
                        React.createElement(TeamListBox, { teams: this.props.teamReducer.teams, onSelectTeam: this.onSelectTeam }),
                        React.createElement(TeamCreateBox, Object.assign({}, this.props))),
                    React.createElement(Flexbox, { flexGrow: 1 })),
                React.createElement(Flexbox, { flexGrow: 1 }),
                React.createElement(Flexbox, { element: "footer" },
                    React.createElement(StalkCompEnhancer, null)))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return Object.assign({}, state); }
export const TeamPage = connect(mapStateToProps)(Team);
