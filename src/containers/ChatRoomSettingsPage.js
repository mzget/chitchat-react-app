"use strict";
exports.__esModule = true;
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var ChatRoomOverview_1 = require("./ChatRoomOverview");
var DialogBox_1 = require("../components/DialogBox");
var ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var title = "Room settings";
var ChatRoomSettingsWithToolbar = ToolbarEnhancer_1.ToolbarEnhancer(function (_a) {
    var onBackPressed = _a.onBackPressed, onError = _a.onError, history = _a.history, match = _a.match;
    return React.createElement("div", null,
        React.createElement(SimpleToolbar_1.SimpleToolbar, { title: title, onBackPressed: onBackPressed }),
        React.createElement(ChatRoomOverview_1.ChatRoomOverview, { match: match, onError: onError }));
});
var ChatRoomSettingsWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, history = _a.history, match = _a.match;
    return React.createElement("div", null,
        React.createElement(ChatRoomSettingsWithToolbar, { onError: onError, history: history, match: match }),
        React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }));
});
exports.ChatRoomSettingsEnhanced = react_router_dom_1.withRouter(ChatRoomSettingsWithDialogBox);
