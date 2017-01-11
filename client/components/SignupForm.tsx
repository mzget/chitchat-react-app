import * as React from "react";
import { Flex, Box } from 'reflexbox';
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
            <Flex flexColumn  >
                <Box justify='center' align='center' p={2}>
                    <h3>Sign-up</h3>
                    <p>Enter your information</p>
                </Box>
                <TextField hintText="Email address" errorText="This field is required" value={props.email} onChange={props.onEmailChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <TextField hintText="Password" errorText="This field is required" value={props.password} onChange={props.onPasswordChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <TextField hintText="Confirm password" errorText="This field is required" value={props.confirmPassword} onChange={props.onConfirmPasswordChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <TextField hintText="Firstname" value={props.firstname} onChange={props.onFirstnameChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <TextField hintText="Lastname" value={props.lastname} onChange={props.onLastnameChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <SubmitButton {...props} />
            </Flex>
        </MuiThemeProvider >
    );
}