import * as React from "react";
import { HomeWithState } from "./Home";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const HomePageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }: any) => (
    <div>
        <HomeWithState onError={onError} location={location} router={router} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));