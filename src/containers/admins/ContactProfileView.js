"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const material_ui_1 = require("material-ui");
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
const SelectOrgChart = (props) => (React.createElement(material_ui_1.SelectField, { floatingLabelText: "Org Charts", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(material_ui_1.MenuItem, { key: id, value: id, primaryText: value.chart_name })) : null));
exports.ContactProfileView = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(material_ui_1.Subheader, null, "Profile"),
            React.createElement("p", null, props.member.username),
            React.createElement("p", null, props.member.firstname),
            React.createElement("p", null, props.member.lastname),
            React.createElement("p", null, props.member.email),
            React.createElement(SelectOrgChart, Object.assign({}, props)),
            React.createElement(SubmitButton, Object.assign({}, props)))));
};
