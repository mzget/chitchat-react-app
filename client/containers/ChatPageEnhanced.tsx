import * as React from "react";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

import { ChatPage } from "./Chat";

export const ChatPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router, params }: any) => (
    <div>
        <ChatPage onError={onError} location={location} router={router} params={params} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));