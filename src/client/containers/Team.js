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
const userRx = require("../redux/user/userRx");
const teamRx = require("../redux/team/teamRx");
const authRx = require("../redux/authen/authRx");
const TeamListBox_1 = require("./teams/TeamListBox");
const TeamCreateBox_1 = require("./teams/TeamCreateBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
class IComponentNameProps {
}
;
;
/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component {
    componentWillMount() {
        console.log("Main", this.props);
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onToolbarMenuItem = this.onToolbarMenuItem.bind(this);
        let { location: { query: { userId, username, roomId, contactId, agent_name } }, params } = this.props;
        this.state = {
            toolbar: 'Teams'
        };
        if (params.filter) {
            this.props.dispatch(userRx.fetchUser(params.filter));
        }
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, authReducer, teamReducer } = nextProps;
        switch (userReducer.state) {
            case userRx.FETCH_USER_SUCCESS:
                if (userReducer.state != this.props.userReducer.state) {
                    this.props.dispatch(teamRx.getTeamsInfo(userReducer.user.teams));
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
        (!!teamReducer.teams && teamReducer.teams.length > 0) ?
            this.setState({ toolbar: 'Your Teams' }) : this.setState({ toolbar: 'Create Team' });
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
    render() {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, teamReducer } = this.props;
        return (React.createElement("div", null,
            React.createElement(SimpleToolbar_1.default, { title: this.state.toolbar, menus: ["logout"], onSelectedMenuItem: this.onToolbarMenuItem }),
            (!!teamReducer.teams && teamReducer.teams.length > 0) ?
                React.createElement(TeamListBox_1.default, __assign({}, this.props, { onSelectTeam: this.onSelectTeam })) :
                React.createElement(TeamCreateBox_1.default, __assign({}, this.props))));
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
