"use strict";
const React = require("react");
const material_ui_1 = require("material-ui");
exports.SelectOrgChart = (props) => (React.createElement(material_ui_1.SelectField, { floatingLabelText: "Org Charts", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value.chart_name })) : null));
