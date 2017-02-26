"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CreateGroupView_1 = require("./CreateGroupView");
const SelectOrgChartView_1 = require("./SelectOrgChartView");
const Room_1 = require("../../../server/scripts/models/Room");
const groupRx = require("../../redux/group/groupRx");
const privateGroupRx = require("../../redux/group/privateGroupRxActions");
exports.createOrgGroup = "create-org-group";
exports.createPjbGroup = "create-projectbase-group";
exports.createPvGroup = "create-group";
;
class CreateGroupBox extends React.Component {
    constructor() {
        super(...arguments);
        this.group = {};
    }
    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: "",
            dropdownValue: 0
        };
        this.getView = this.getView.bind(this);
        this.onSubmitGroup = this.onSubmitGroup.bind(this);
    }
    onSubmitGroup() {
        console.log("submit group", this.state);
        const { teamReducer, adminReducer: { orgCharts }, userReducer: { user } } = this.props;
        if (this.state.groupName.length > 0) {
            this.group.name = this.state.groupName;
            this.group.image = this.state.groupImage;
            this.group.description = this.state.groupDescription;
            this.group.team_id = teamReducer.team._id;
            switch (this.props.groupType) {
                case exports.createOrgGroup:
                    this.group.type = Room_1.RoomType.organizationGroup;
                    this.group.org_chart_id = (orgCharts.length > 0) ? orgCharts[this.state.dropdownValue]._id : null;
                    this.props.dispatch(groupRx.createOrgGroup(this.group));
                    break;
                case exports.createPvGroup:
                    let member = {
                        _id: user._id,
                        room_role: Room_1.MemberRole.owner,
                        username: user.username
                    };
                    this.group.type = Room_1.RoomType.privateGroup;
                    this.group.members = new Array(member);
                    this.props.dispatch(privateGroupRx.createPrivateGroup(this.group));
                    break;
                default:
                    break;
            }
        }
        else {
            this.props.onError("Missing some require field");
        }
    }
    getView() {
        let prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: (e, text) => this.setState(previous => (Object.assign({}, previous, { groupName: text }))),
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: (e, text) => this.setState(previous => (Object.assign({}, previous, { groupDescription: text }))),
            onSubmit: this.onSubmitGroup
        };
        let chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: (event, id, value) => this.setState(previous => (Object.assign({}, previous, { dropdownValue: value })))
        };
        switch (this.props.groupType) {
            case exports.createOrgGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPjbGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPvGroup:
                return CreateGroupView_1.CreateGroupView(prop)(null);
            default:
                break;
        }
    }
    ;
    render() {
        return (React.createElement("div", null,
            " ",
            this.getView()));
    }
}
exports.default = CreateGroupBox;
