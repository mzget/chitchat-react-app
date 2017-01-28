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
const CreateOrgChartForm_1 = require("./CreateOrgChartForm");
const OrgChartListView_1 = require("./OrgChartListView");
const OrgChart_1 = require("../../../server/scripts/models/OrgChart");
const adminRx = require("../../redux/admin/adminRx");
class IComponentNameProps {
}
;
;
class ManageOrgChartBox extends React.Component {
    constructor() {
        super(...arguments);
        this.orgChart = {};
        this.orgLevels = new Array();
    }
    componentWillMount() {
        this.orgChart.chart_name = "";
        this.orgChart.chart_description = "";
        this.orgLevels = [OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.department], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.division], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.section], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.unit]];
        this.state = {
            dropdownValue: 0,
            chart_name: "",
            chart_description: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        const { teamReducer } = this.props;
        if (!teamReducer.team) {
            this.props.router.replace("/");
        }
        this.props.dispatch(adminRx.getOrgChart(teamReducer.team._id));
    }
    onSubmit() {
        const { teamReducer } = this.props;
        if (this.state.chart_name.length > 0) {
            this.orgChart.chart_level = this.state.dropdownValue;
            this.orgChart.team_id = teamReducer.team._id;
            this.orgChart.chart_name = this.state.chart_name;
            this.orgChart.chart_description = this.state.chart_description;
            this.props.dispatch(adminRx.createNewOrgChart(this.orgChart));
        }
        else {
            this.props.onError("Missing require field");
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(OrgChartListView_1.OrgChartListView, { items: null }),
            React.createElement(CreateOrgChartForm_1.CreateOrgChartForm, { orgChartName: this.state.chart_name, orgChart_description: this.state.chart_description, onOrgChartNameChange: (e, text) => { this.setState(previous => (__assign({}, previous, { chart_name: text }))); }, onOrgChartDescriptionChange: (e, text) => { this.setState(previous => (__assign({}, previous, { chart_description: text }))); }, dropdownItems: this.orgLevels, dropdownValue: this.state.dropdownValue, dropdownChange: (event, id, value) => { this.setState(previous => (__assign({}, previous, { dropdownValue: value }))); }, onSubmit: this.onSubmit })));
    }
}
exports.ManageOrgChartBox = ManageOrgChartBox;
