import * as React from "react";
import { AdminPage } from "./Admin";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const AdminPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history }: any) => (
    <div>
        <AdminPage onError={onError} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));