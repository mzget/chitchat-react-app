import * as React from "react";
import { withRouter } from "react-router-dom";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ChatRoomSettingsPage } from "./ChatRoomSettings";
import { DialogBox } from "../components/DialogBox";

import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";

const title = "Room settings";

const ChatRoomSettingsWithToolbar = ToolbarEnhancer(({ onBackPressed, onError, history, match }) =>
    <div>
        <SimpleToolbar title={title} onBackPressed={onBackPressed} />
        <ChatRoomSettingsPage match={match} onError={onError} />
    </div>
);

let ChatRoomSettingsWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) =>
    <div>
        <ChatRoomSettingsWithToolbar onError={onError} history={history} match={match} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
);

export const ChatRoomSettingsEnhanced = withRouter(ChatRoomSettingsWithDialogBox);
