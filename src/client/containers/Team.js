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
const immutable = require("immutable");
const userRx = require("../redux/user/userRx");
const teamRx = require("../redux/team/teamRx");
const authRx = require("../redux/authen/authRx");
const DialogBox_1 = require("../components/DialogBox");
const TeamListBox_1 = require("./teams/TeamListBox");
const TeamCreateBox_1 = require("./teams/TeamCreateBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
;
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
        console.log("Main", this.props);
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        let { location: { query: { userId, username, roomId, contactId } }, params } = this.props;
        this.toolbar = "Teams",
            this.state = {
                openDialog: false
            };
        if (params.filter) {
            this.props.dispatch(userRx.fetchUser(params.filter));
        }
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, authReducer, teamReducer } = nextProps;
        switch (userReducer.state) {
            case userRx.FETCH_USER_SUCCESS:
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
        this.toolbar = (!!teamReducer.teams && teamReducer.teams.length > 0) ? 'Your Teams' : 'Create Team';
        switch (teamReducer.state) {
            case teamRx.CREATE_TEAM_FAILURE: {
                this.alertBoxTitle = teamRx.CREATE_TEAM_FAILURE;
                this.alertBoxMessage = teamReducer.error;
                this.setState(previous => (__assign({}, previous, { openDialog: true })));
                break;
            }
            default:
                break;
        }
    }
    onSelectTeam(team) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.router.push(`/chatslist/${team.name}`);
    }
    onToolbarMenuItem(id, value) {
        if (value == 'logout') {
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
                React.createElement(SimpleToolbar_1.default, { title: this.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }),
                React.createElement(TeamListBox_1.default, __assign({}, this.props, { onSelectTeam: this.onSelectTeam })),
                React.createElement(TeamCreateBox_1.default, __assign({}, this.props)),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertBoxTitle, message: this.alertBoxMessage, open: this.state.openDialog, handleClose: this.onCloseDialog }))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Team);
