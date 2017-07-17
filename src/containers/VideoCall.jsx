import * as React from "react";
import { VideoCallPage } from "./voip/VideoCallPage";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox } from "../components/DialogBox";
export const VideoCallEnhance = DialogBoxEnhancer(({ title, message, open, handleClose, onError }) => (<div>
        <VideoCallPage onError={onError}/>
        <DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>));
