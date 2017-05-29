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
var reflexbox_1 = require("reflexbox");
var FlatButton_1 = require("material-ui/FlatButton");
var Colors = require("material-ui/styles/colors");
var CreateOrgChartForm_1 = require("./CreateOrgChartForm");
var OrgChartListView_1 = require("./OrgChartListView");
var OrgChart_1 = require("../../chitchat/chats/models/OrgChart");
var adminRx = require("../../redux/admin/adminRx");
var IComponentNameProps = (function () {
    function IComponentNameProps() {
    }
    return IComponentNameProps;
}());
;
;
var ManageOrgChartBox = (function (_super) {
    __extends(ManageOrgChartBox, _super);
    function ManageOrgChartBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.orgChart = {};
        _this.orgLevels = new Array();
        return _this;
    }
    ManageOrgChartBox.prototype.componentWillMount = function () {
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
    };
    ManageOrgChartBox.prototype.componentWillReceiveProps = function (nextProps) {
        var adminReducer = nextProps.adminReducer;
        switch (adminReducer.state) {
            case adminRx.CREATE_NEW_ORG_CHART_SUCCESS:
                this.setState(function (prevState) { return (__assign({}, prevState, { isOpenCreateNewForm: false })); });
                break;
            default:
                break;
        }
    };
    ManageOrgChartBox.prototype.onSubmit = function () {
        var teamReducer = this.props.teamReducer;
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
    };
    ManageOrgChartBox.prototype.onCreateNew = function () {
        var _this = this;
        this.setState(function (prevState) { return (__assign({}, prevState, { isOpenCreateNewForm: !_this.state.isOpenCreateNewForm })); });
    };
    ManageOrgChartBox.prototype.render = function () {
        var _this = this;
        return (React.createElement(reflexbox_1.Flex, { flexColumn: true, justify: "center", style: { backgroundColor: Colors.indigo50 } }, (this.state.isOpenCreateNewForm) ? (React.createElement(CreateOrgChartForm_1.CreateOrgChartForm, { orgChartName: this.state.chart_name, orgChart_description: this.state.chart_description, onOrgChartNameChange: function (e, text) { _this.setState(function (previous) { return (__assign({}, previous, { chart_name: text })); }); }, onOrgChartDescriptionChange: function (e, text) { _this.setState(function (previous) { return (__assign({}, previous, { chart_description: text })); }); }, dropdownItems: this.orgLevels, dropdownValue: this.state.dropdownValue, dropdownChange: function (event, id, value) { _this.setState(function (previous) { return (__assign({}, previous, { dropdownValue: value })); }); }, onSubmit: this.onSubmit })) : (React.createElement("div", null,
            React.createElement(OrgChartListView_1.OrgChartListView, { items: this.props.adminReducer.orgCharts }),
            React.createElement(FlatButton_1["default"], { label: "Create New", primary: true, onClick: this.onCreateNew })))));
    };
    return ManageOrgChartBox;
}(React.Component));
exports.__esModule = true;
exports["default"] = ManageOrgChartBox;
