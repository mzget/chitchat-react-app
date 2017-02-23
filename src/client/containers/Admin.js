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
const AdminMenu_1 = require("./admins/AdminMenu");
const ManageOrgChartBox_1 = require("./admins/ManageOrgChartBox");
const CreateGroupBox_1 = require("./admins/CreateGroupBox");
const TeamMemberBox_1 = require("./admins/TeamMemberBox");
const DialogBox_1 = require("../components/DialogBox");
const adminRx = require("../redux/admin/adminRx");
const groupRx = require("../redux/group/groupRx");
const privateGroupRxActions = require("../redux/group/privateGroupRxActions");
const User_1 = require("../../server/scripts/models/User");
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isCreateGroup"] = 1] = "isCreateGroup";
    BoxState[BoxState["isManageTeam"] = 2] = "isManageTeam";
    BoxState[BoxState["isManageMember"] = 3] = "isManageMember";
})(BoxState || (BoxState = {}));
;
;
class Admin extends React.Component {
    constructor() {
        super(...arguments);
        this.alertTitle = "";
        this.alertMessage = "";
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
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }
    componentDidMount() {
        const { teamReducer } = this.props;
        if (!teamReducer.team) {
            this.props.router.replace("/");
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
            this.onAlert(groupReducer.error);
        }
    }
    onAdminMenuSelected(key) {
        console.log("onAdminMenuSelected", key);
        let { userReducer } = this.props;
        if (key == CreateGroupBox_1.createOrgGroup || key == CreateGroupBox_1.createPjbGroup || key == CreateGroupBox_1.createPvGroup) {
            if (key == CreateGroupBox_1.createOrgGroup && userReducer.user.role != User_1.UserRole[User_1.UserRole.admin]) {
                return this.onAlert("Request for admin permision");
            }
            if (key == CreateGroupBox_1.createPjbGroup) {
                return this.onAlert("Not yet ready...");
            }
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.isCreateGroup, menuSelected: key })));
        }
        else if (key == this.manageOrgChart) {
            if (userReducer.user.role == User_1.UserRole[User_1.UserRole.admin]) {
                this.setState(previous => (__assign({}, previous, { boxState: BoxState.isManageTeam })));
            }
            else {
                this.onAlert("Request for admin permision");
            }
        }
        else if (key == this.teamMember) {
            if (userReducer.user.role == User_1.UserRole[User_1.UserRole.admin]) {
                this.setState(previous => (__assign({}, previous, { boxState: BoxState.isManageMember })));
            }
            else {
                this.onAlert("Request for admin permision");
            }
        }
    }
    onBackPressed() {
        if (this.state.boxState) {
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.idle })));
        }
        else {
            // Jump to main menu.
            this.props.router.goBack();
        }
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (__assign({}, prevState, { alert: false })), () => {
            this.props.dispatch(groupRx.emptyState());
            this.props.dispatch(adminRx.emptyState());
        });
    }
    onAlert(error) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => (__assign({}, previous, { alert: true })));
    }
    getAdminPanel() {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return React.createElement(ManageOrgChartBox_1.default, __assign({}, this.props, { onError: this.onAlert }));
            case BoxState.isCreateGroup:
                return React.createElement(CreateGroupBox_1.default, __assign({}, this.props, { groupType: this.state.menuSelected, onError: this.onAlert }));
            case BoxState.isManageMember:
                return React.createElement(TeamMemberBox_1.TeamMemberBox, __assign({}, this.props, { onError: this.onAlert }));
            default:
                return React.createElement(AdminMenu_1.AdminMenu, { menus: this.menus, onSelectItem: this.onAdminMenuSelected });
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(SimpleToolbar_1.default, { title: "Admin", onBackPressed: this.onBackPressed }),
                this.getAdminPanel(),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert }))));
    }
}
const mapstateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapstateToProps)(Admin);
