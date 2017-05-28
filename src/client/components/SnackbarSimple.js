import * as React from "react";
import Snackbar from "material-ui/Snackbar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
export const SnackbarSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null,
        React.createElement(Snackbar, { open: props.open, message: props.message, autoHideDuration: (props.hideDuration) ? props.hideDuration : 4000, onRequestClose: props.handleRequestClose }))));
