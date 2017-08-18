import * as React from "react";
import { TeamPage } from "./Team";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox } from "../components/DialogBox";
export const TeamPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history }) => (<div>
        <TeamPage onError={onError} location={location} history={history}/>
        <DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>));
