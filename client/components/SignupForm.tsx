import * as React from "react";
import Flexbox from "flexbox-react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    span: {
        padding: 8
    },
    button: {
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};

const SubmitButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </RaisedButton>
);

interface ITypingBox {
    onSubmit: () => void;
    email: string;
    password: string;
    confirmPassword: string;
    firstname: string;
    lastname: string;
    onEmailChange: (event, text) => void;
    onPasswordChange: (event, text) => void;
    onConfirmPasswordChange: (event, text) => void;
    onFirstnameChange: (event, text) => void;
    onLastnameChange: (event, text) => void;
}

export const SignupForm = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flexbox flexDirection="column"  >
                <div>
                    <h3 style={{ fontFamily: "Roboto", fontSize: 16 }}>Sign-up</h3>
                    <p style={{ fontFamily: "Roboto", fontSize: 14 }}>Enter your information</p>
                </div>
                <TextField hintText="Email address" fullWidth={true}
                    errorText={(!props.email) ? "This field is required" : ""}
                    value={props.email} onChange={props.onEmailChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                <span style={styles.span} />
                <TextField hintText="Password" fullWidth={true} type="password"
                    errorText={(!props.password) ? "This field is required" : ""}
                    value={props.password} onChange={props.onPasswordChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                <span style={styles.span} />
                <TextField hintText="Confirm password" fullWidth={true} type="password"
                    errorText={(!props.confirmPassword) ? "This field is required" : ""} value={props.confirmPassword} onChange={props.onConfirmPasswordChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                <span style={styles.span} />
                <TextField hintText="Firstname" fullWidth={true} value={props.firstname}
                    errorText={(!props.firstname) ? "This field is required" : ""} onChange={props.onFirstnameChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                <span style={styles.span} />
                <TextField hintText="Lastname" fullWidth={true} value={props.lastname}
                    errorText={(!props.lastname) ? "This field is required" : ""} onChange={props.onLastnameChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                <span style={styles.span} />
                <SubmitButton {...props} />
            </Flexbox>
        </MuiThemeProvider >
    );
}