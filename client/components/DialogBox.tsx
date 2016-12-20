import * as React from "react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const actions = (props) => [
    <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={props.handleClose}
        />,
    <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={props.handleClose}
        />,
];
export const DialogBox = (props: { handleClose, open: boolean }) => {
    return (
        < MuiThemeProvider >
            <Dialog
                title="Dialog With Actions"
                actions={actions(props)}
                modal={false}
                open={props.open}
                onRequestClose={props.handleClose}
                >
                The actions in this window were passed in as an array of React objects.
            </Dialog>
        </MuiThemeProvider >
    );
}