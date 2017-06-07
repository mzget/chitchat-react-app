"use strict";
var React = require("react");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
exports.SelectOrgChartView = function (props) { return (<SelectField_1.default floatingLabelText="Org Charts" value={props.dropdownValue} onChange={props.dropdownChange}>
        {(props.dropdownItems.length > 0) ?
    props.dropdownItems.map(function (value, id) {
        return <MenuItem_1.default key={id} value={id} primaryText={value.chart_name}/>;
    }) : null}
    </SelectField_1.default>); };
