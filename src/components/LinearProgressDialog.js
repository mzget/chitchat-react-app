import * as React from "react";
import { Flex } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import LinearProgressSimple from "./LinearProgressSimple";
const actions = (props) => [
    React.createElement(FlatButton, { label: "OK", primary: true, onMouseUp: props.handleClose })
];
export const LinearProgressDialog = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement("div", null,
            React.createElement(Dialog, { title: props.title, actions: actions(props), modal: true, open: props.open, onRequestClose: props.handleClose },
                React.createElement(Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple, null))))));
};
