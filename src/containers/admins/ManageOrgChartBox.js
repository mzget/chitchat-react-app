"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const FlatButton_1 = require("material-ui/FlatButton");
const Colors = require("material-ui/styles/colors");
const CreateOrgChartForm_1 = require("./CreateOrgChartForm");
const OrgChartListView_1 = require("./OrgChartListView");
const OrgChart_1 = require("../../chitchat/chats/models/OrgChart");
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
            chart_description: "",
            isOpenCreateNewForm: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onCreateNew = this.onCreateNew.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { adminReducer } = nextProps;
        switch (adminReducer.state) {
            case adminRx.CREATE_NEW_ORG_CHART_SUCCESS:
                this.setState(prevState => (Object.assign({}, prevState, { isOpenCreateNewForm: false })));
                break;
            default:
                break;
        }
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
    onCreateNew() {
        this.setState(prevState => (Object.assign({}, prevState, { isOpenCreateNewForm: !this.state.isOpenCreateNewForm })));
    }
    render() {
        return (React.createElement(reflexbox_1.Flex, { flexColumn: true, justify: "center", style: { backgroundColor: Colors.indigo50 } }, (this.state.isOpenCreateNewForm) ? (React.createElement(CreateOrgChartForm_1.CreateOrgChartForm, { orgChartName: this.state.chart_name, orgChart_description: this.state.chart_description, onOrgChartNameChange: (e, text) => { this.setState(previous => (Object.assign({}, previous, { chart_name: text }))); }, onOrgChartDescriptionChange: (e, text) => { this.setState(previous => (Object.assign({}, previous, { chart_description: text }))); }, dropdownItems: this.orgLevels, dropdownValue: this.state.dropdownValue, dropdownChange: (event, id, value) => { this.setState(previous => (Object.assign({}, previous, { dropdownValue: value }))); }, onSubmit: this.onSubmit })) : (React.createElement("div", null,
            React.createElement(OrgChartListView_1.OrgChartListView, { items: this.props.adminReducer.orgCharts }),
            React.createElement(FlatButton_1.default, { label: "Create New", primary: true, onClick: this.onCreateNew })))));
    }
}
exports.default = ManageOrgChartBox;
