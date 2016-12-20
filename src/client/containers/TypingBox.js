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
export const SendButton = (props) => (React.createElement(RaisedButton, { label: "Send", primary: true, onTouchEnd: props.onSubmit, onMouseUp: props.onSubmit }));
export const TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement("div", null,
            React.createElement(TextField, { hintText: "Type your message", value: props.value, onChange: props.onValueChange, onKeyPress: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(SendButton, { onSubmit: props.onSubmit }))));
};
