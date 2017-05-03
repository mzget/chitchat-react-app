"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const teamRx = require("../redux/team/teamRx");
const authRx = require("../redux/authen/authRx");
const TeamListBox_1 = require("./teams/TeamListBox");
const TeamCreateBox_1 = require("./teams/TeamCreateBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
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
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: this.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }),
                React.createElement(TeamListBox_1.TeamListBox, { teams: this.props.teamReducer.teams, onSelectTeam: this.onSelectTeam }),
                React.createElement(TeamCreateBox_1.TeamCreateBox, __assign({}, this.props)))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
exports.TeamPage = react_redux_1.connect(mapStateToProps)(Team);
