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
export const SendButton = () => (React.createElement(RaisedButton, { label: "Send", primary: true, onTouchTap: () => { } }));
export const TypingBox = () => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null,
        React.createElement(TextField, { hintText: "Hint Text" }),
        React.createElement("span", { style: styles.span }),
        React.createElement(SendButton, null))));
