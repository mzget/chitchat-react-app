import * as React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const actions = (props) => [
    React.createElement(FlatButton, { label: "Cancel", primary: true, onMouseUp: props.handleClose }),
    React.createElement(FlatButton, { label: "Submit", primary: true, keyboardFocused: true, onMouseUp: props.handleClose }),
];
export const DialogBox = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement("div", null,
            React.createElement(Dialog, { title: "Dialog With Actions", actions: actions(props), modal: false, open: props.open, onRequestClose: props.handleClose }, "The actions in this window were passed in as an array of React objects."))));
};
