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
const CreateGroupView_1 = require("./CreateGroupView");
const SelectOrgChartView_1 = require("./SelectOrgChartView");
const Room_1 = require("../../../server/scripts/models/Room");
const groupRx = require("../../redux/group/groupRx");
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
        this.onDropDownChange = this.onDropDownChange.bind(this);
    }
    onSubmitGroup() {
        console.log("submit group", this.state);
        const { teamReducer, adminReducer: { orgCharts } } = this.props;
        if (this.state.groupName.length > 0) {
            this.group.name = this.state.groupName;
            this.group.image = this.state.groupImage;
            this.group.description = this.state.groupDescription;
            this.group.type = Room_1.RoomType.organizationGroup;
            this.group.team_id = teamReducer.team._id;
            this.group.org_chart_id = (orgCharts.length > 0) ? orgCharts[this.state.dropdownValue]._id : null;
            this.props.dispatch(groupRx.createGroup(this.group));
        }
        else {
            this.props.onError("Missing some require field");
        }
    }
    onDropDownChange(event, id, value) {
        this.setState(previous => (__assign({}, previous, { dropdownValue: value })));
    }
    getView() {
        let prop = {
            image: this.state.groupImage,
            group_name: this.state.groupName,
            onGroupNameChange: (e, text) => this.setState(previous => (__assign({}, previous, { groupName: text }))),
            group_description: this.state.groupDescription,
            onGroupDescriptionChange: (e, text) => this.setState(previous => (__assign({}, previous, { groupDescription: text }))),
            onSubmit: this.onSubmitGroup
        };
        let chart = {
            dropdownItems: this.props.adminReducer.orgCharts,
            dropdownValue: this.state.dropdownValue,
            dropdownChange: this.onDropDownChange
        };
        switch (this.props.groupType) {
            case exports.createOrgGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPjbGroup:
                return CreateGroupView_1.CreateGroupView(prop)(SelectOrgChartView_1.SelectOrgChartView(chart));
            case exports.createPvGroup:
                return CreateGroupView_1.CreateGroupView(prop);
            default:
                break;
        }
    }
    ;
    render() {
        return (React.createElement("div", null, this.getView()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateGroupBox;
