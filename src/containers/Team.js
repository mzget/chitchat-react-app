"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var flexbox_react_1 = require("flexbox-react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var teamRx = require("../redux/team/teamRx");
var authRx = require("../redux/authen/authRx");
var TeamListBox_1 = require("./teams/TeamListBox");
var TeamCreateBox_1 = require("./teams/TeamCreateBox");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var StalkComponent_1 = require("./stalk/StalkComponent");
/**
 * Containers of chatlist, chatlogs, etc...
 */
var Team = (function (_super) {
    __extends(Team, _super);
    function Team() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Team.prototype.componentWillMount = function () {
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        var _a = this.props, location = _a.location, userReducer = _a.userReducer;
        this.toolbar = (!!userReducer.user)
            ? userReducer.user.username : "Fail username";
    };
    Team.prototype.componentWillReceiveProps = function (nextProps) {
        var location = nextProps.location, userReducer = nextProps.userReducer, authReducer = nextProps.authReducer, teamReducer = nextProps.teamReducer;
        if (teamReducer.error) {
            this.props.onError(teamReducer.error);
        }
        if (!userReducer.user ||
            authReducer.state == authRx.LOG_OUT_SUCCESS) {
            this.props.history.replace("/");
        }
    };
    Team.prototype.onSelectTeam = function (team) {
        this.props.dispatch(teamRx.selectTeam(team));
        this.props.history.push("/chatslist/" + team.name);
    };
    Team.prototype.onToolbarMenuItem = function (id, value) {
        if (value == "logout") {
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
        }
    };
    Team.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement(flexbox_react_1["default"], { flexDirection: "column", minHeight: "100vh" },
                React.createElement(flexbox_react_1["default"], { element: "header" },
                    React.createElement("div", { style: { width: "100%" } },
                        React.createElement(SimpleToolbar_1.SimpleToolbar, { title: this.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }))),
                React.createElement(flexbox_react_1["default"], { flexDirection: "column", flexGrow: 1 },
                    React.createElement(TeamListBox_1.TeamListBox, { teams: this.props.teamReducer.teams, onSelectTeam: this.onSelectTeam }),
                    React.createElement(TeamCreateBox_1.TeamCreateBox, __assign({}, this.props))),
                React.createElement(flexbox_react_1["default"], { element: "footer" },
                    React.createElement(StalkComponent_1.StalkCompEnhancer, null)))));
    };
    return Team;
}(React.Component));
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
exports.TeamPage = react_redux_1.connect(mapStateToProps)(Team);
