"use strict";
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ChatRoomOverview_1 = require("./ChatRoomOverview");
const DialogBox_1 = require("../components/DialogBox");
const ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const title = "Room settings";
const ChatRoomSettingsWithToolbar = ToolbarEnhancer_1.ToolbarEnhancer(({ onBackPressed, onError, history, match }) => React.createElement("div", null,
    React.createElement(SimpleToolbar_1.SimpleToolbar, { title: title, onBackPressed: onBackPressed }),
    React.createElement(ChatRoomOverview_1.ChatRoomOverview, { match: match, onError: onError })));
let ChatRoomSettingsWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => React.createElement("div", null,
    React.createElement(ChatRoomSettingsWithToolbar, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
exports.ChatRoomSettingsEnhanced = react_router_dom_1.withRouter(ChatRoomSettingsWithDialogBox);
