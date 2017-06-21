"use strict";
exports.__esModule = true;
var React = require("react");
var material_ui_1 = require("material-ui");
exports.SelectOrgChart = function (props) { return (React.createElement(material_ui_1.SelectField, { value: props.dropdownValue, onChange: props.dropdownChange, style: { width: "100%" } }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map(function (value, id) {
        return React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value.chart_name });
    }) : null)); };
