import * as React from "react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { FileReaderBox } from "../components/FileReaderBox";

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
                <FileReaderBox />
                <TextField hintText="Type your message" value={props.value} onChange={props.onValueChange} onKeyPress={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <SendButton onSubmit={props.onSubmit} />
            </div>
        </MuiThemeProvider >
    );
}