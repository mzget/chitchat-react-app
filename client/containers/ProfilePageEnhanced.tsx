import * as React from "react";
import { ProfilePage } from "./Profile";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const ProfilePageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router }: any) => (
    <div>
        <ProfilePage onError={onError} location={location} router={router} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));