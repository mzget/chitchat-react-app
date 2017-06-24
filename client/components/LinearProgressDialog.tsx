import * as React from "react";
import Flexbox from "flexbox-react";

import { RaisedButton, TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import LinearProgressSimple from "./LinearProgressSimple";

interface ICompProps {
    title?: string;
    message?: string;
    open: boolean;
    handleClose: () => void;
}
const actions = (props: ICompProps) => [
    <FlatButton
        label="OK"
        primary={true}
        onMouseUp={props.handleClose}
    />
];
export const LinearProgressDialog = (props: ICompProps) => {
    return (
        <MuiThemeProvider>
            <div>
                <Dialog
                    title={props.title}
                    actions={actions(props)}
                    modal={true}
                    open={props.open}
                    onRequestClose={props.handleClose} >
                    {/*{props.message}*/}
                    <Flexbox alignItems="center">
                        <LinearProgressSimple />
                    </Flexbox>
                </Dialog>
            </div>
        </MuiThemeProvider>
    );
};