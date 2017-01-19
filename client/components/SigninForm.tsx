import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    span: {
        padding: 2
    },
    button: {
        width:'100%'
    },
    textfield: {
        width: '100%'
    }
};

const SubmitButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </RaisedButton>
);

interface ITypingBox {
    onSubmit: () => void;
    username: string;
    password: string;
    onUsername: (event, text) => void;
    onPassword: (event, text) => void;
}

export const SigninForm = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flex flexColumn align='center' >
                <Box justify='center' align='center' p={2}>
                    <h3>Sign-in</h3>
                    <p>Enter your email address and password</p>
                </Box>
                <span style={styles.span} />
                <TextField hintText="Type username here." value={props.username} onChange={props.onUsername} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } style={styles.textfield} />
                <span style={styles.span} />
                <TextField type='password' hintText="Password" value={props.password} onChange={props.onPassword} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } style={styles.textfield} />
                <span style={styles.span} />
                <SubmitButton {...props} />
            </Flex>
        </MuiThemeProvider >
    );
}