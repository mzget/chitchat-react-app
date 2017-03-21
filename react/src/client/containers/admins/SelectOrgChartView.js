"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SelectField_1 = require("material-ui/SelectField");
const MenuItem_1 = require("material-ui/MenuItem");
exports.SelectOrgChartView = (props) => (React.createElement(SelectField_1.default, { floatingLabelText: "Org Charts", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(MenuItem_1.default, { key: id, value: id, primaryText: value.chart_name })) : null));
