"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var styles = {
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
var SubmitButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="Sign in" onClick={props.onSubmit} style={styles.button}> </material_ui_1.RaisedButton>); };
exports.SigninForm = function (props) {
    return (<MuiThemeProvider_1.default>
            <reflexbox_1.Flex flexColumn align='center'>
                <reflexbox_1.Box justify='center' align='center' p={2}>
                    <h3>Sign-in</h3>
                    <p>Enter your email address and password</p>
                </reflexbox_1.Box>
                <span style={styles.span}/>
                <material_ui_1.TextField hintText="Type username here." value={props.username} onChange={props.onUsername} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }} style={styles.textfield}/>
                <span style={styles.span}/>
                <material_ui_1.TextField type='password' hintText="Password" value={props.password} onChange={props.onPassword} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }} style={styles.textfield}/>
                <span style={styles.span}/>
                <SubmitButton {...props}/>
            </reflexbox_1.Flex>
        </MuiThemeProvider_1.default>);
};
