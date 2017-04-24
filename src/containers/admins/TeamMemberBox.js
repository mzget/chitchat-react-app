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
const recompose_1 = require("recompose");
const MemberList_1 = require("../chatlist/MemberList");
const ContactProfileView_1 = require("./ContactProfileView");
const adminRx = require("../../redux/admin/adminRx");
const teamRx = require("../../redux/team/teamRx");
const UserRole_1 = require("../../chitchat/chats/models/UserRole");
const react_bootstrap_1 = require("react-bootstrap");
const material_ui_1 = require("material-ui");
const Styles = require("../../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;
class TeamMemberBox extends React.Component {
    constructor() {
        super(...arguments);
        this.userRoles = [
            UserRole_1.UserRole[UserRole_1.UserRole.personnel],
            UserRole_1.UserRole[UserRole_1.UserRole.section_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.department_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.division_chief],
            UserRole_1.UserRole[UserRole_1.UserRole.admin]
        ];
    }
    componentWillMount() {
        this.state = {
            member: null,
            dropdownValue: 0,
            teamRoleValue: 0
        };
        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { adminReducer, teamReducer } = nextProps;
        if (!recompose_1.shallowEqual(adminReducer, this.props.adminReducer)) {
            if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_FAILURE) {
                this.props.onError(adminReducer.error);
            }
            else if (adminReducer.state == adminRx.UPDATE_USER_ORG_CHART_SUCCESS || adminReducer.state == adminRx.UPDATE_USER_TEAM_ROLE_SUCCESS) {
                this.setState(previous => (__assign({}, previous, { member: null })));
                this.props.dispatch(adminRx.emptyState());
                this.props.dispatch(teamRx.getTeamMembers(teamReducer.team._id));
            }
        }
    }
    onSelectMember(item) {
        let { adminReducer: { orgCharts } } = this.props;
        console.log("onSelectMember", item);
        if (item.teamProfiles.length === 0) {
            this.setState(previous => (__assign({}, previous, { member: item, dropdownValue: -1 })));
        }
        else {
            let charts = orgCharts;
            let chart_ids = charts.findIndex((v, i, arr) => {
                return v._id.toString() === item.teamProfiles[0].org_chart_id;
            });
            let role_id = this.userRoles.findIndex((v, i) => {
                return v == item.teamProfiles[0].team_role.toString();
            });
            this.setState(previous => (__assign({}, previous, { member: item, dropdownValue: chart_ids, teamRoleValue: role_id })));
        }
    }
    onSubmit() {
        let { adminReducer: { orgCharts }, teamReducer: { team } } = this.props;
        let _member = this.state.member;
        if (orgCharts.length > 0 && this.state.dropdownValue >= 0) {
            this.orgChart_id = orgCharts[this.state.dropdownValue]._id;
        }
        this.userRole = this.userRoles[this.state.teamRoleValue];
        console.log(_member, this.orgChart_id, this.userRole);
        if (_member) {
            if (this.orgChart_id)
                this.props.dispatch(adminRx.updateUserOrgChart(_member, team._id, this.orgChart_id));
            if (this.userRole) {
                let profile = { team_role: this.userRole };
                this.props.dispatch(adminRx.updateUserTeamRole(_member._id, team._id, profile));
            }
        }
        else {
            if (this.props.onError) {
                this.props.onError("WTF");
            }
        }
    }
    render() {
        return ((!!this.state.member) ?
            React.createElement(ContactProfileView_1.ContactProfileView, { member: this.state.member, onSubmit: this.onSubmit, dropdownItems: this.props.adminReducer.orgCharts, dropdownValue: this.state.dropdownValue, dropdownChange: (event, id, value) => {
                    console.log("org chart change", value);
                    this.setState(previous => (__assign({}, previous, { dropdownValue: value })));
                }, teamRoleItems: this.userRoles, teamRoleValue: this.state.teamRoleValue, onTeamRoleChange: (event, id, value) => {
                    console.log("team role change", value);
                    this.setState(prev => (__assign({}, prev, { teamRoleValue: value })));
                } })
            :
                React.createElement(react_bootstrap_1.Row, null,
                    React.createElement(react_bootstrap_1.Col, { md: 6, mdOffset: 3 },
                        React.createElement(material_ui_1.Card, null,
                            React.createElement(material_ui_1.CardTitle, { title: "User List", subtitle: "User List" })),
                        React.createElement("div", { style: PageBox },
                            React.createElement(MemberList_1.MemberList, { onSelected: this.onSelectMember, items: this.props.teamReducer.members })))));
    }
}
exports.TeamMemberBox = TeamMemberBox;
