import * as React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
const actions = (props) => [
    <FlatButton label="OK" primary={true} onMouseUp={props.handleClose}/>,
];
export const DialogBox = (props) => {
    return (<MuiThemeProvider>
            <div>
                <Dialog title={props.title} actions={actions(props)} modal={true} open={props.open} onRequestClose={props.handleClose}>
                    {props.message}
                </Dialog>
            </div>
        </MuiThemeProvider>);
};
