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
const CreateOrgChartForm_1 = require("./CreateOrgChartForm");
const OrgChart_1 = require("../../../server/scripts/models/OrgChart");
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
        this.orgLevels = [OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.department], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.division], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.section], OrgChart_1.OrgLevel[OrgChart_1.OrgLevel.unit]];
        this.state = {
            dropdownValue: 0
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit() {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(CreateOrgChartForm_1.CreateOrgChartForm, __assign({}, this.props, { orgChartName: this.orgChart.chart_name, orgChart_description: this.orgChart.chart_description, onOrgChartNameChange: (e, text) => { this.orgChart.chart_name = text; }, onOrgChartDescriptionChange: (e, text) => { this.orgChart.chart_description = text; }, dropdownItems: this.orgLevels, dropdownValue: this.state.dropdownValue, dropdownChange: (event, id, value) => { this.setState(previous => (__assign({}, previous, { dropdownValue: value }))); }, onSubmit: this.onSubmit }))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect()(ManageOrgChartBox);
