"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const styles = {
    span: {
        padding: 2
    },
    button: {
        width: '100%'
    },
    textfield: {
        width: '100%'
    }
};
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign in", onClick: props.onSubmit, style: styles.button }, " "));
exports.SigninForm = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, { flexColumn: true, align: 'center' },
            React.createElement(reflexbox_1.Box, { justify: 'center', align: 'center', p: 2 },
                React.createElement("h3", null, "Sign-in"),
                React.createElement("p", null, "Enter your email address and password")),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Type username here.", value: props.username, onChange: props.onUsername, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                }, style: styles.textfield }),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { type: 'password', hintText: "Password", value: props.password, onChange: props.onPassword, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                }, style: styles.textfield }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SubmitButton, Object.assign({}, props)))));
};
