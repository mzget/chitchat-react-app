import * as React from "react";
import { withRouter } from "react-router-dom";
import { HomeWithState } from "./Home";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox } from "../components/DialogBox";
export let HomePageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history }) => (React.createElement("div", null,
    React.createElement(HomeWithState, { onError: onError, history: history }),
    React.createElement(DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
HomePageWithDialogBox = withRouter(HomePageWithDialogBox);
