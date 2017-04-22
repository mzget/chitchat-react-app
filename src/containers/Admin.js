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
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const MenuListView_1 = require("./admins/MenuListView");
const ManageOrgChartBox_1 = require("./admins/ManageOrgChartBox");
const CreateGroupBox_1 = require("./admins/CreateGroupBox");
const TeamMemberBox_1 = require("./admins/TeamMemberBox");
const adminRx = require("../redux/admin/adminRx");
const groupRx = require("../redux/group/groupRx");
const privateGroupRxActions = require("../redux/group/privateGroupRxActions");
const UserRole_1 = require("../chitchat/chats/models/UserRole");
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isCreateGroup"] = 1] = "isCreateGroup";
    BoxState[BoxState["isManageTeam"] = 2] = "isManageTeam";
    BoxState[BoxState["isManageMember"] = 3] = "isManageMember";
})(BoxState || (BoxState = {}));
class Admin extends React.Component {
    constructor() {
        super(...arguments);
        this.manageOrgChart = "Manage ORG Chart";
        this.teamMember = "team-member";
        this.menus = [this.manageOrgChart, CreateGroupBox_1.createOrgGroup, CreateGroupBox_1.createPjbGroup, CreateGroupBox_1.createPvGroup, this.teamMember];
    }
    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            menuSelected: "",
            alert: false,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    }
    componentDidMount() {
        const { teamReducer } = this.props;
        if (!teamReducer.team) {
            this.props.history.replace("/");
        }
        this.props.dispatch(adminRx.getOrgChart(teamReducer.team._id));
    }
    componentWillReceiveProps(nextProps) {
        const { groupReducer, adminReducer } = nextProps;
        if (groupReducer.state == groupRx.CREATE_ORG_GROUP_SUCCESS ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS) {
            this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.idle })));
        }
        else if (groupReducer.state == groupRx.CREATE_ORG_GROUP_FAILURE ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE) {
            this.props.onError(groupReducer.error);
        }
    }
    onAdminMenuSelected(key) {
        console.log("on-Admin-Menu-Selected", key);
        let { userReducer } = this.props;
        if (key == CreateGroupBox_1.createOrgGroup || key == CreateGroupBox_1.createPjbGroup || key == CreateGroupBox_1.createPvGroup) {
            if (key == CreateGroupBox_1.createOrgGroup && userReducer.teamProfile.team_role != UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                return this.props.onError("Request for admin permision");
            }
            if (key == CreateGroupBox_1.createPjbGroup) {
                return this.props.onError("Not yet ready...");
            }
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.isCreateGroup, menuSelected: key })));
        }
        else if (key == this.manageOrgChart) {
            if (userReducer.teamProfile.team_role == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                this.setState(previous => (__assign({}, previous, { boxState: BoxState.isManageTeam })));
            }
            else {
                this.props.onError("Request for admin permision");
            }
        }
        else if (key == this.teamMember) {
            if (userReducer.teamProfile.team_role == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                this.setState(previous => (__assign({}, previous, { boxState: BoxState.isManageMember })));
            }
            else {
                this.props.onError("Request for admin permision");
            }
        }
    }
    onBackPressed() {
        if (this.state.boxState) {
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.idle })));
        }
        else {
            // Jump to main menu.
            this.props.history.goBack();
        }
    }
    getAdminPanel() {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return React.createElement(ManageOrgChartBox_1.default, __assign({}, this.props, { onError: this.props.onError }));
            case BoxState.isCreateGroup:
                return React.createElement(CreateGroupBox_1.default, __assign({}, this.props, { groupType: this.state.menuSelected, onError: this.props.onError }));
            case BoxState.isManageMember:
                return React.createElement(TeamMemberBox_1.TeamMemberBox, __assign({}, this.props, { onError: this.props.onError }));
            default:
                return React.createElement(MenuListView_1.MenuListview, { menus: this.menus, onSelectItem: this.onAdminMenuSelected });
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", { style: { position: "relative", } },
                React.createElement("div", { style: { position: "relative", height: "56px" } },
                    React.createElement("div", { style: { position: "fixed", width: "100%", zIndex: 1 } },
                        React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Admin", onBackPressed: this.onBackPressed }))),
                React.createElement("div", { style: { position: "relative", overflowX: "hidden", height: "calc(100vh - 56px)" } }, this.getAdminPanel()))));
    }
}
const mapstateToProps = (state) => (__assign({}, state));
exports.AdminPage = react_redux_1.connect(mapstateToProps)(Admin);
