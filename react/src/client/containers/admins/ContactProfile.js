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
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
const SelectChart = (props) => (React.createElement(material_ui_1.SelectField, { floatingLabelText: "Org Charts", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value.chart_name })) : null));
exports.ContactProfileView = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(material_ui_1.Subheader, null, "Profile"),
            React.createElement("p", null, props.member.username),
            React.createElement("p", null, props.member.firstname),
            React.createElement("p", null, props.member.lastname),
            React.createElement("p", null, props.member.email),
            React.createElement(SelectChart, __assign({}, props)),
            React.createElement(SubmitButton, __assign({}, props)))));
};
