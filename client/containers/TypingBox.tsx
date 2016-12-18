import * as React from "react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
    span: {
        padding: 10
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
export const SendButton = () => (
    <RaisedButton label="Send" primary={true} onTouchTap={() => { } } />
);

export const TypingBox = () => (
    <MuiThemeProvider>
        <div>
            <TextField hintText="Hint Text" />
            <span style={styles.span} />
            <SendButton />
        </div>
    </MuiThemeProvider>
);