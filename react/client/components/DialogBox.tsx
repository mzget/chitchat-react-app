import * as React from "react";
import { RaisedButton, TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

interface ICompProps {
    title: string;
    message: string;
    open: boolean;
    handleClose: () => void;
}
const actions = (props: ICompProps) => [
    <FlatButton
        label="OK"
        primary={true}
        onMouseUp={props.handleClose}
    />,
];
export const DialogBox = (props: ICompProps) => {
    return (
        <MuiThemeProvider>
            <div>
                <Dialog
                    title={props.title}
                    actions={actions(props)}
                    modal={true}
                    open={props.open}
                    onRequestClose={props.handleClose}
                >
                    {props.message}
                </Dialog>
            </div>
        </MuiThemeProvider>
    );
};