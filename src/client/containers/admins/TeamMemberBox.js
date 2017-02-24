"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MemberList_1 = require("../chatlist/MemberList");
const ContactProfileView_1 = require("./ContactProfileView");
const adminRx = require("../../redux/admin/adminRx");
;
class TeamMemberBox extends React.Component {
    componentWillMount() {
        this.state = {
            member: null,
            dropdownValue: 0
        };
        this.onSelectMember = this.onSelectMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { adminReducer } = nextProps;
        switch (adminReducer.state) {
            case adminRx.UPDATE_USER_ORG_CHART_FAILURE: {
                this.props.onError(adminReducer.error);
                break;
            }
            case adminRx.UPDATE_USER_ORG_CHART_SUCCESS: {
                this.setState(previous => (Object.assign({}, previous, { member: null })));
                this.props.dispatch(adminRx.emptyState());
                break;
            }
            default:
                break;
        }
    }
    onSelectMember(item) {
        let { adminReducer: { orgCharts } } = this.props;
        console.log("onSelectMember", item);
        if (item.teamProfiles.length === 0) {
            this.setState(previous => (Object.assign({}, previous, { member: item, dropdownValue: -1 })));
        }
        else {
            let charts = orgCharts;
            let chart_ids = charts.findIndex((v, i, arr) => {
                return v._id.toString() === item.teamProfiles[0].org_chart_id;
            });
            this.setState(previous => (Object.assign({}, previous, { member: item, dropdownValue: chart_ids })));
        }
    }
    onSubmit() {
        let { adminReducer: { orgCharts }, teamReducer: { team } } = this.props;
        let _member = this.state.member;
        if (orgCharts.length > 0 && this.state.dropdownValue >= 0) {
            this.orgChart_id = orgCharts[this.state.dropdownValue]._id;
        }
        if (_member) {
            this.props.dispatch(adminRx.updateUserOrgChart(_member, team._id, this.orgChart_id));
        }
        else {
            if (this.props.onError) {
                this.props.onError("WTF");
            }
        }
    }
    render() {
        return (React.createElement(reflexbox_1.Flex, { flexColumn: false },
            React.createElement(reflexbox_1.Flex, { flexColumn: true, align: "center" }, (!!this.state.member) ?
                React.createElement(ContactProfileView_1.ContactProfileView, { member: this.state.member, onSubmit: this.onSubmit, dropdownItems: this.props.adminReducer.orgCharts, dropdownValue: this.state.dropdownValue, dropdownChange: (event, id, value) => { this.setState(previous => (Object.assign({}, previous, { dropdownValue: value }))); } })
                :
                    React.createElement(MemberList_1.MemberList, { onSelected: this.onSelectMember, value: this.props.teamReducer.members }))));
    }
}
exports.TeamMemberBox = TeamMemberBox;
