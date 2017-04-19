"use strict";
const React = require("react");
const material_ui_1 = require("material-ui");
exports.SelectTeamRole = (props) => (React.createElement(material_ui_1.SelectField, { floatingLabelText: "Team Roles", value: props.teamRoleValue, onChange: props.onTeamRoleChange }, (props.teamRoleItems.length > 0) ?
    props.teamRoleItems.map((value, id) => React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value })) : null));
