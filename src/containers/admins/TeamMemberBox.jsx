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
var recompose_1 = require("recompose");
var MemberList_1 = require("../../components/MemberList");
var ContactProfileView_1 = require("./ContactProfileView");
var adminRx = require("../../redux/admin/adminRx");
var teamRx = require("../../redux/team/teamRx");
var UserRole_1 = require("../../chitchat/chats/models/UserRole");
var react_bootstrap_1 = require("react-bootstrap");
var material_ui_1 = require("material-ui");
var Styles = require("../../styles/generalStyles");
var PageBox = Styles.generalStyles.pageBox;
var TeamMemberBox = (function (_super) {
    __extends(TeamMemberBox, _super);
    function TeamMemberBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userRoles = [
            UserRole_1.UserRole[UserRole_1.UserRole.personnel],
            UserRole_1.UserRole[UserRole_1.UserRole.section_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.department_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.division_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.admin]
        ];
        return _this;
    }
    TeamMemberBox.prototype.componentWillMount = function () {
        this.state = {
            member: null,
            dropdownValue: 0,
            teamRoleValue: 0
        };
        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };
    TeamMemberBox.prototype.componentWillReceiveProps = function (nextProps) {
        var adminReducer = nextProps.adminReducer, teamReducer = nextProps.teamReducer;
        if (!recompose_1.shallowEqual(adminReducer, this.props.adminReducer)) {
            if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_FAILURE) {
                this.props.onError(adminReducer.error);
            }
            else if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_SUCCESS || adminReducer.state == adminRx.UPDATE_USER_TEAM_ROLE_SUCCESS) {
                this.setState(function (previous) { return (__assign({}, previous, { member: null })); });
                this.props.dispatch(adminRx.emptyState());
                this.props.dispatch(teamRx.getTeamMembers(teamReducer.team._id));
            }
        }
    };
    TeamMemberBox.prototype.onSelectMember = function (item) {
        var orgCharts = this.props.adminReducer.orgCharts;
        console.log("onSelectMember", item);
        if (item.teamProfiles.length === 0) {
            this.setState(function (previous) { return (__assign({}, previous, { member: item, dropdownValue: -1 })); });
        }
        else {
            var charts = orgCharts;
            var chart_ids_1 = charts.findIndex(function (v, i, arr) {
                return v._id.toString() === item.teamProfiles[0].org_chart_id;
            });
            var role_id_1 = this.userRoles.findIndex(function (v, i) {
                return v == item.teamProfiles[0].team_role.toString();
            });
            this.setState(function (previous) { return (__assign({}, previous, { member: item, dropdownValue: chart_ids_1, teamRoleValue: role_id_1 })); });
        }
    };
    TeamMemberBox.prototype.onSubmit = function () {
        var _a = this.props, orgCharts = _a.adminReducer.orgCharts, team = _a.teamReducer.team;
        var _member = this.state.member;
        if (orgCharts.length > 0 && this.state.dropdownValue >= 0) {
            this.orgChart_id = orgCharts[this.state.dropdownValue]._id;
        }
        this.userRole = this.userRoles[this.state.teamRoleValue];
        console.log(_member, this.orgChart_id, this.userRole);
        if (_member) {
            if (this.orgChart_id)
                this.props.dispatch(adminRx.updateUserOrgChart(_member, team._id, this.orgChart_id));
            if (this.userRole) {
                var profile = { team_role: this.userRole };
                this.props.dispatch(adminRx.updateUserTeamRole(_member._id, team._id, profile));
            }
        }
        else {
            if (this.props.onError) {
                this.props.onError("WTF");
            }
        }
    };
    TeamMemberBox.prototype.render = function () {
        var _this = this;
        return ((!!this.state.member) ?
            <ContactProfileView_1.ContactProfileView member={this.state.member} onSubmit={this.onSubmit} dropdownItems={this.props.adminReducer.orgCharts} dropdownValue={this.state.dropdownValue} dropdownChange={function (event, id, value) {
                console.log("org chart change", value);
                _this.setState(function (previous) { return (__assign({}, previous, { dropdownValue: value })); });
            }} teamRoleItems={this.userRoles} teamRoleValue={this.state.teamRoleValue} onTeamRoleChange={function (event, id, value) {
                console.log("team role change", value);
                _this.setState(function (prev) { return (__assign({}, prev, { teamRoleValue: value })); });
            }}/>
            :
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6} mdOffset={3}>
                        <material_ui_1.Card>
                            <material_ui_1.CardTitle title="User List" subtitle="User List"/>
                        </material_ui_1.Card>
                        <div style={PageBox}>
                            <MemberList_1.MemberList onSelected={this.onSelectMember} items={this.props.teamReducer.members}/>
                        </div>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>);
    };
    return TeamMemberBox;
}(React.Component));
exports.TeamMemberBox = TeamMemberBox;
