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
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const material_ui_1 = require("material-ui");
const styles = {
    span: {
        padding: 8
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
exports.CreateOrgChartForm = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: 'center' },
        React.createElement(reflexbox_1.Box, { justify: 'center', align: 'center', p: 2 },
            React.createElement("h3", null, "Roles management"),
            React.createElement("p", null, "Enter a new role base name")),
        React.createElement(material_ui_1.TextField, { hintText: "Role", errorText: "This field is required", value: props.role_name, onChange: props.onRoleNameChange, onKeyDown: (e) => {
                if (e.key === 'Enter')
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(SubmitButton, __assign({}, props)))));
