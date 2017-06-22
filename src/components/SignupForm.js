import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: styles.button }));
export const SignupForm = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement(Flex, { flexColumn: true },
            React.createElement(Box, { justify: 'center', align: 'center', p: 2 },
                React.createElement("h3", null, "Sign-up"),
                React.createElement("p", null, "Enter your information")),
            React.createElement(TextField, { hintText: "Email address", errorText: "This field is required", value: props.email, onChange: props.onEmailChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "Password", type: "password", errorText: "This field is required", value: props.password, onChange: props.onPasswordChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "Confirm password", type: "password", errorText: "This field is required", value: props.confirmPassword, onChange: props.onConfirmPasswordChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "Firstname", value: props.firstname, onChange: props.onFirstnameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(TextField, { hintText: "Lastname", value: props.lastname, onChange: props.onLastnameChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement(SubmitButton, Object.assign({}, props)))));
};
