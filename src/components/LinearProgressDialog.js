import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { LinearProgressSimple } from "./LinearProgressSimple";
const actions = (props) => [
    <FlatButton label="OK" primary={true} onMouseUp={props.handleClose}/>
];
export const LinearProgressDialog = (props) => {
    return (<MuiThemeProvider>
            <div>
                <Dialog title={props.title} actions={actions(props)} modal={true} open={props.open} onRequestClose={props.handleClose}>
                    
                    <Flexbox alignItems="center">
                        <LinearProgressSimple />
                    </Flexbox>
                </Dialog>
            </div>
        </MuiThemeProvider>);
};
