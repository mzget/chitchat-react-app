var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "Sign in", onClick: props.onSubmit, style: styles.button }, " "));
export const SigninForm = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement(Flex, { flexColumn: true, align: 'center' },
            React.createElement(Box, { justify: 'center', align: 'center', p: 2 },
                React.createElement("h3", null, "Sign-in"),
                React.createElement("p", null, "Enter your email address and password")),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "Type username here.", value: props.username, onChange: props.onUsername, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                }, style: styles.textfield }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { type: 'password', hintText: "Password", value: props.password, onChange: props.onPassword, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                }, style: styles.textfield }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SubmitButton, __assign({}, props)))));
};
