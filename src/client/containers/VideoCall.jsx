import * as React from "react";
import { VideoCallComp } from "./voip/VideoCallComponent";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox } from "../components/DialogBox";
export const VideoCallEnhance = DialogBoxEnhancer(({ title, message, open, handleClose, onError }) => (<div>
        <VideoCallComp onError={onError}/>
        <DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>));
