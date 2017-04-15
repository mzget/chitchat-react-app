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
const userRx = require("../redux/user/userRx");
const teamRx = require("../redux/team/teamRx");
const authRx = require("../redux/authen/authRx");
const DialogBox_1 = require("../components/DialogBox");
const TeamListBox_1 = require("./teams/TeamListBox");
const TeamCreateBox_1 = require("./teams/TeamCreateBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component {
    constructor() {
        super(...arguments);
        this.alertBoxMessage = "";
        this.alertBoxTitle = "";
    }
    componentWillMount() {
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        let { location: { query: { userId, username, roomId, contactId } }, params, userReducer } = this.props;
        this.state = {
            openDialog: false
        };
        this.toolbar = (!!userReducer.user)
            ? userReducer.user.username : "Fail username";
        switch (userReducer.state) {
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
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, authReducer, teamReducer } = nextProps;
        if (teamReducer.error) {
            this.alertBoxTitle = "Alert!";
            this.alertBoxMessage = teamReducer.error;
            this.setState(previous => (__assign({}, previous, { openDialog: true })));
        }
        if (!userReducer.user ||
            authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.router.replace("/");
        }
    }
    onSelectTeam(team) {
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
        this.setState(previous => (__assign({}, previous, { openDialog: false })), () => {
            this.props.dispatch(teamRx.clearError());
        });
    }
    render() {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, teamReducer } = this.props;
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: this.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }),
                React.createElement(TeamListBox_1.TeamListBox, { teams: this.props.teamReducer.teams, onSelectTeam: this.onSelectTeam }),
                React.createElement(TeamCreateBox_1.default, __assign({}, this.props)),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertBoxTitle, message: this.alertBoxMessage, open: this.state.openDialog, handleClose: this.onCloseDialog }))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Team);
