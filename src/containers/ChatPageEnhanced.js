"use strict";
const React = require("react");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const ToolbarEnhancer_1 = require("./toolsbox/ToolbarEnhancer");
const DialogBox_1 = require("../components/DialogBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const Chat_1 = require("./Chat");
const options = "Options";
const favorite = "Favorite";
const toolbarMenus = [options, favorite];
const listener = (props, id, value) => {
    console.log(id, value);
    let { chatroomReducer, router } = props;
    if (toolbarMenus[id] == options) {
        props.router.push(`/chat/settings/${chatroomReducer.room._id}`);
    }
};
const ToolbarEnhanced = ToolbarEnhancer_1.ToolbarEnhancer(({ chatroomReducer, onMenuSelect, onBackPressed, history, listener }) => (React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty", menus: toolbarMenus, onSelectedMenuItem: onMenuSelect, onBackPressed: onBackPressed })));
const ChatPageEnhanced = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history, match }) => (React.createElement("div", null,
    React.createElement(ToolbarEnhanced, { history: history, listener: listener }),
    React.createElement(Chat_1.ChatPage, { onError: onError, location: location, router: history, params: match }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }))));
exports.ConnectedChatPageEnhanced = ChatPageEnhanced;
