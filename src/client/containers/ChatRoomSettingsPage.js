import * as React from "react";
import { withRouter } from "react-router-dom";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { ChatRoomOverview } from "./ChatRoomOverview";
import { DialogBox } from "../components/DialogBox";
import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
const title = "Room settings";
const ChatRoomSettingsWithToolbar = ToolbarEnhancer(({ onBackPressed, onError, history, match }) => React.createElement("div", null,
    React.createElement(SimpleToolbar, { title: title, onBackPressed: onBackPressed }),
    React.createElement(ChatRoomOverview, { match: match, onError: onError })));
let ChatRoomSettingsWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => React.createElement("div", null,
    React.createElement(ChatRoomSettingsWithToolbar, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
export const ChatRoomSettingsEnhanced = withRouter(ChatRoomSettingsWithDialogBox);
