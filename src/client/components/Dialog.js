import * as React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const actions = [
    React.createElement(FlatButton, { label: "Cancel", primary: true, onTouchTap: this.handleClose }),
    React.createElement(FlatButton, { label: "Submit", primary: true, keyboardFocused: true, onTouchTap: this.handleClose }),
];
export const DialogBox = () => {
    return (React.createElement("div", null,
        React.createElement(Dialog, { title: "Dialog With Actions", actions: actions, modal: false, open: this.state.open, onRequestClose: this.handleClose }, "The actions in this window were passed in as an array of React objects.")));
};
