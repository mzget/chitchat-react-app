import * as React from "react";
import { ProfilePage } from "./Profile";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const m_ProfilePageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history }: any) => (
    <div>
        <ProfilePage onError={onError} location={location} history={history} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));