"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const material_ui_1 = require("material-ui");
const SelectOrgChart_1 = require("../../components/SelectOrgChart");
const SelectTeamRole_1 = require("../../components/SelectTeamRole");
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
exports.ContactProfileView = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(material_ui_1.Subheader, null, "Profile"),
            React.createElement("p", null, props.member.username),
            React.createElement("p", null, props.member.firstname),
            React.createElement("p", null, props.member.lastname),
            React.createElement("p", null, props.member.email),
            React.createElement(SelectOrgChart_1.SelectOrgChart, { dropdownItems: props.dropdownItems, dropdownValue: props.dropdownValue, dropdownChange: props.dropdownChange }),
            React.createElement(SelectTeamRole_1.SelectTeamRole, { teamRoleItems: props.teamRoleItems, teamRoleValue: props.teamRoleValue, onTeamRoleChange: props.onTeamRoleChange }),
            React.createElement(SubmitButton, __assign({}, props)))));
};
