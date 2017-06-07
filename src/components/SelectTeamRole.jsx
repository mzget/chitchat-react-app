"use strict";
var React = require("react");
var material_ui_1 = require("material-ui");
exports.SelectTeamRole = function (props) { return (<material_ui_1.SelectField value={props.teamRoleValue} onChange={props.onTeamRoleChange} style={{ width: "100%" }}>
        {(props.teamRoleItems.length > 0) ?
    props.teamRoleItems.map(function (value, id) {
        return <material_ui_1.MenuItem key={id} value={id} primaryText={value}/>;
    }) : null}
    </material_ui_1.SelectField>); };
