"use strict";
var React = require("react");
var material_ui_1 = require("material-ui");
exports.SelectOrgChart = function (props) { return (<material_ui_1.SelectField value={props.dropdownValue} onChange={props.dropdownChange} style={{ width: "100%" }}>

        {(props.dropdownItems.length > 0) ?
    props.dropdownItems.map(function (value, id) {
        return <material_ui_1.MenuItem key={id} value={id} primaryText={value.chart_name}/>;
    }) : null}
    </material_ui_1.SelectField>); };
