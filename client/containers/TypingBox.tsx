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
export const SendButton = (props) => (
    <RaisedButton label="Send" primary={true} onTouchEnd={props.onSubmit} onMouseUp={props.onSubmit} />
);

export const TypingBox = (props) => {
    return (
        < MuiThemeProvider >
            <div>
                <TextField hintText="Type your message" value={props.value} onChange={props.onValueChange} />
                <span style={styles.span} />
                <SendButton onSubmit={props.onSubmit} />
            </div>
        </MuiThemeProvider >
    );
}