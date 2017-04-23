"use strict";
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
const DialogBox_1 = require("../components/DialogBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const Chat_1 = require("./Chat");
const options = "Options";
const favorite = "Favorite";
const toolbarMenus = [options, favorite];
const listener = (props, id, value) => {
    let { chatroomReducer, history } = props;
    if (toolbarMenus[id] == options) {
        history.push(`/chatroom/settings/${chatroomReducer.room._id}`);
    }
};
const ToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(({ chatroomReducer, onMenuSelect, onBackPressed, history, listener }) => (React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty", menus: toolbarMenus, onSelectedMenuItem: onMenuSelect, onBackPressed: onBackPressed })));
exports.ChatPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => (React.createElement("div", null,
    React.createElement(ToolbarEnhanced, { history: history, listener: listener }),
    React.createElement(Chat_1.ChatPage, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
exports.ChatPageEnhanced = react_router_dom_1.withRouter(exports.ChatPageEnhanced);
