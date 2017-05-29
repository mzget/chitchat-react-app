"use strict";
var React = require("react");
var material_ui_1 = require("material-ui");
exports.SelectTeamRole = function (props) { return (React.createElement(material_ui_1.SelectField, { value: props.teamRoleValue, onChange: props.onTeamRoleChange, style: { width: "100%" } }, (props.teamRoleItems.length > 0) ?
    props.teamRoleItems.map(function (value, id) {
        return React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value });
    }) : null)); };
