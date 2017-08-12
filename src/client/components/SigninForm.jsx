import * as React from "react";
import Flexbox from "flexbox-react";
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
const SubmitButton = (props) => (<RaisedButton primary={true} label="Sign in" onClick={props.onSubmit} style={styles.button}> </RaisedButton>);
export const SigninForm = (props) => {
    return (<MuiThemeProvider>
            <Flexbox flexDirection="column">
                <div>
                    <h3 style={{ fontFamily: "Roboto", fontSize: 16 }}>Sign-in</h3>
                    <p style={{ fontFamily: "Roboto", fontSize: 14 }}> Enter your email address and password</p>
                </div>
                <span style={styles.span}/>
                <TextField hintText="Type email address here." value={props.username} onChange={props.onUsername} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }} style={styles.textfield}/>
                <span style={styles.span}/>
                <TextField type='password' hintText="Password" value={props.password} onChange={props.onPassword} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }} style={styles.textfield}/>
                <span style={styles.span}/>
                <SubmitButton {...props}/>
            </Flexbox>
        </MuiThemeProvider>);
};
