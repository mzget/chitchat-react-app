import * as React from "react";
import Flexbox from "flexbox-react";
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
const SubmitButton = (props) => (<RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </RaisedButton>);
export const SignupForm = (props) => {
    return (<MuiThemeProvider>
            <Flexbox flexDirection="column">
                <div>
                    <h3>Sign-up</h3>
                    <p>Enter your information</p>
                </div>
                <TextField hintText="Email address" errorText="This field is required" value={props.email} onChange={props.onEmailChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <TextField hintText="Password" type="password" errorText="This field is required" value={props.password} onChange={props.onPasswordChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <TextField hintText="Confirm password" type="password" errorText="This field is required" value={props.confirmPassword} onChange={props.onConfirmPasswordChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <TextField hintText="Firstname" value={props.firstname} onChange={props.onFirstnameChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <TextField hintText="Lastname" value={props.lastname} onChange={props.onLastnameChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <SubmitButton {...props}/>
            </Flexbox>
        </MuiThemeProvider>);
};
