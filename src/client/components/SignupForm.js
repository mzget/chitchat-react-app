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
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const styles = {
    span: {
        padding: 8
    },
    button: {},
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: styles.button }));
exports.SignupForm = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, { flexColumn: true },
            React.createElement(reflexbox_1.Box, { justify: 'center', align: 'center', p: 2 },
                React.createElement("h3", null, "Sign-up"),
                React.createElement("p", null, "Enter your information")),
            React.createElement(material_ui_1.TextField, { hintText: "Email address", errorText: "This field is required", value: props.email, onChange: props.onEmailChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Password", type: "password", errorText: "This field is required", value: props.password, onChange: props.onPasswordChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Confirm password", type: "password", errorText: "This field is required", value: props.confirmPassword, onChange: props.onConfirmPasswordChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Firstname", value: props.firstname, onChange: props.onFirstnameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Lastname", value: props.lastname, onChange: props.onLastnameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement(SubmitButton, __assign({}, props)))));
};
