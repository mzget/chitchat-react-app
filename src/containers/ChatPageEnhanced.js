"use strict";
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
var DialogBox_1 = require("../components/DialogBox");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var Chat_1 = require("./Chat");
var options = "Options";
var favorite = "Favorite";
var toolbarMenus = [options, favorite];
var listener = function (props, id, value) {
    var chatroomReducer = props.chatroomReducer, history = props.history;
    if (toolbarMenus[id] == options) {
        history.push("/chatroom/settings/" + chatroomReducer.room._id);
    }
};
var ToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(function (_a) {
    var chatroomReducer = _a.chatroomReducer, onMenuSelect = _a.onMenuSelect, onBackPressed = _a.onBackPressed, history = _a.history, listener = _a.listener;
    return (React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty", menus: toolbarMenus, onSelectedMenuItem: onMenuSelect, onBackPressed: onBackPressed }));
});
exports.ChatPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, history = _a.history, match = _a.match;
    return (React.createElement("div", null,
        React.createElement(ToolbarEnhanced, { history: history, listener: listener }),
        React.createElement(Chat_1.ChatPage, { onError: onError, history: history, match: match }),
        React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
});
exports.ChatPageEnhanced = react_router_dom_1.withRouter(exports.ChatPageEnhanced);
