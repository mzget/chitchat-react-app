import * as React from "react";
// import { VideoCallPage } from "./voip/VideoCallPage";
import { VideoCallComp } from "./voip/VideoCallComponent";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const VideoCallEnhance = DialogBoxEnhancer(({ title, message, open, handleClose, onError }: any) => (
    <div>
        <VideoCallComp onError={onError} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));