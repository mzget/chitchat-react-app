"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var react_redux_1 = require("react-redux");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var MenuListView_1 = require("./admins/MenuListView");
var ManageOrgChartBox_1 = require("./admins/ManageOrgChartBox");
var CreateGroupBox_1 = require("./admins/CreateGroupBox");
var TeamMemberBox_1 = require("./admins/TeamMemberBox");
var adminRx = require("../redux/admin/adminRx");
var groupRx = require("../redux/group/groupRx");
var privateGroupRxActions = require("../redux/group/privateGroupRxActions");
var UserRole_1 = require("../chitchat/chats/models/UserRole");
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isCreateGroup"] = 1] = "isCreateGroup";
    BoxState[BoxState["isManageTeam"] = 2] = "isManageTeam";
    BoxState[BoxState["isManageMember"] = 3] = "isManageMember";
})(BoxState || (BoxState = {}));
var Admin = (function (_super) {
    __extends(Admin, _super);
    function Admin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.manageOrgChart = "Manage ORG Chart";
        _this.teamMember = "team-member";
        _this.developerIssue = "Developer Issue";
        _this.menus = [_this.manageOrgChart, CreateGroupBox_1.createOrgGroup, CreateGroupBox_1.createPjbGroup, CreateGroupBox_1.createPvGroup, _this.teamMember, _this.developerIssue];
        return _this;
    }
    Admin.prototype.componentWillMount = function () {
        this.state = {
            boxState: BoxState.idle,
            menuSelected: "",
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    };
    Admin.prototype.componentDidMount = function () {
        var teamReducer = this.props.teamReducer;
        if (!teamReducer.team) {
            this.props.history.replace("/");
        }
        this.props.dispatch(adminRx.getOrgChart(teamReducer.team._id));
    };
    Admin.prototype.componentWillReceiveProps = function (nextProps) {
        var groupReducer = nextProps.groupReducer, adminReducer = nextProps.adminReducer;
        if (groupReducer.state == groupRx.CREATE_ORG_GROUP_SUCCESS ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS) {
            this.setState(function (prevState) { return (__assign({}, prevState, { boxState: BoxState.idle })); });
        }
        else if (groupReducer.state == groupRx.CREATE_ORG_GROUP_FAILURE ||
            groupReducer.state == privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE) {
            this.props.onError(groupReducer.error);
        }
    };
    Admin.prototype.onAdminMenuSelected = function (key) {
        console.log("on-Admin-Menu-Selected", key);
        var userReducer = this.props.userReducer;
        if (key == CreateGroupBox_1.createOrgGroup || key == CreateGroupBox_1.createPjbGroup || key == CreateGroupBox_1.createPvGroup) {
            if (key == CreateGroupBox_1.createOrgGroup && userReducer.teamProfile.team_role != UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                return this.props.onError("Request for admin permision");
            }
            if (key == CreateGroupBox_1.createPjbGroup) {
                return this.props.onError("Not yet ready...");
            }
            this.setState(function (previous) { return (__assign({}, previous, { boxState: BoxState.isCreateGroup, menuSelected: key })); });
        }
        else if (key == this.manageOrgChart) {
            if (userReducer.teamProfile.team_role == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                this.setState(function (previous) { return (__assign({}, previous, { boxState: BoxState.isManageTeam })); });
            }
            else {
                this.props.onError("Request for admin permision");
            }
        }
        else if (key == this.teamMember) {
            if (userReducer.teamProfile.team_role == UserRole_1.UserRole[UserRole_1.UserRole.admin]) {
                this.setState(function (previous) { return (__assign({}, previous, { boxState: BoxState.isManageMember })); });
            }
            else {
                this.props.onError("Request for admin permision");
            }
        }
        else if (key == this.developerIssue) {
            window.open("https://github.com/mzget/chitchat-ionic-app/wiki", '_blank');
        }
    };
    Admin.prototype.onBackPressed = function () {
        if (this.state.boxState) {
            this.setState(function (previous) { return (__assign({}, previous, { boxState: BoxState.idle })); });
        }
        else {
            // Jump to main menu.
            this.props.history.goBack();
        }
    };
    Admin.prototype.getAdminPanel = function () {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return React.createElement(ManageOrgChartBox_1["default"], __assign({}, this.props, { onError: this.props.onError }));
            case BoxState.isCreateGroup:
                return React.createElement(CreateGroupBox_1["default"], __assign({}, this.props, { groupType: this.state.menuSelected, onError: this.props.onError }));
            case BoxState.isManageMember:
                return React.createElement(TeamMemberBox_1.TeamMemberBox, __assign({}, this.props, { onError: this.props.onError }));
            default:
                return React.createElement(MenuListView_1.MenuListview, { menus: this.menus, onSelectItem: this.onAdminMenuSelected });
        }
    };
    Admin.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", { style: { position: "relative" } },
                React.createElement("div", { style: { position: "relative", height: "56px" } },
                    React.createElement("div", { style: { position: "fixed", width: "100%", zIndex: 1 } },
                        React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Admin", onBackPressed: this.onBackPressed }))),
                React.createElement("div", { style: { position: "relative", overflowX: "hidden", height: "calc(100vh - 56px)" } }, this.getAdminPanel()))));
    };
    return Admin;
}(React.Component));
var mapstateToProps = function (state) { return (__assign({}, state)); };
exports.AdminPage = react_redux_1.connect(mapstateToProps)(Admin);
