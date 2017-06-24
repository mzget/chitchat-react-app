import * as React from "react";
import { AdminPage } from "./Admin";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox } from "../components/DialogBox";
export const AdminPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history }) => (React.createElement("div", null,
    React.createElement(AdminPage, { onError: onError }),
    React.createElement(DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
