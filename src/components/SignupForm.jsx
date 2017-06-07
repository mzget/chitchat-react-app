"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var styles = {
    span: {
        padding: 8
    },
    button: {},
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
var SubmitButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </material_ui_1.RaisedButton>); };
exports.SignupForm = function (props) {
    return (<MuiThemeProvider_1.default>
            <reflexbox_1.Flex flexColumn>
                <reflexbox_1.Box justify='center' align='center' p={2}>
                    <h3>Sign-up</h3>
                    <p>Enter your information</p>
                </reflexbox_1.Box>
                <material_ui_1.TextField hintText="Email address" errorText="This field is required" value={props.email} onChange={props.onEmailChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <material_ui_1.TextField hintText="Password" type="password" errorText="This field is required" value={props.password} onChange={props.onPasswordChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <material_ui_1.TextField hintText="Confirm password" type="password" errorText="This field is required" value={props.confirmPassword} onChange={props.onConfirmPasswordChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <material_ui_1.TextField hintText="Firstname" value={props.firstname} onChange={props.onFirstnameChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <material_ui_1.TextField hintText="Lastname" value={props.lastname} onChange={props.onLastnameChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <SubmitButton {...props}/>
            </reflexbox_1.Flex>
        </MuiThemeProvider_1.default>);
};
