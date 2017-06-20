"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var material_ui_1 = require("material-ui");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
var styles = {
    span: {
        padding: 8
    },
    box: {
        bottom: 0,
        position: "absolute"
    },
    customWidth: {
        width: 200,
        fontSize: 16
    }
};
var SubmitButton = function (props) { return (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit })); };
var ChartLevel = function (props) { return (React.createElement(SelectField_1["default"], { floatingLabelText: "Org Level", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map(function (value, id) {
        return React.createElement(MenuItem_1["default"], { key: id, value: id, primaryText: value });
    }) : null)); };
exports.CreateOrgChartForm = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Create new ORG chart")),
        React.createElement(material_ui_1.TextField, { hintText: "Name", errorText: "This field is required", value: props.orgChartName, onChange: props.onOrgChartNameChange, onKeyDown: function (e) {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "Description", value: props.orgChart_description, onChange: props.onOrgChartDescriptionChange, onKeyDown: function (e) {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(ChartLevel, __assign({}, props)),
        React.createElement("span", { style: styles.span }),
        React.createElement(SubmitButton, __assign({}, props))))); };
