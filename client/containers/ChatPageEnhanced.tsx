import * as React from "react";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { ToolbarEnhancer } from "./toolsbox/ToolbarEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";
import { SimpleToolbar } from "../components/SimpleToolbar";

import { ChatPage } from "./Chat";


const options = "Options";
const favorite = "Favorite";
const toolbarMenus = [options, favorite];
const listener = (props, id, value) => {
    let { chatroomReducer, history } = props;
    if (toolbarMenus[id] == options) {
        history.push(`/chatroom/settings/${chatroomReducer.room._id}`);
    }
};

const ToolbarEnhanced = ToolbarEnhancer(({ chatroomReducer, onMenuSelect, onBackPressed, history, listener }: any) => (
    <SimpleToolbar
        title={(chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty"}
        menus={toolbarMenus}
        onSelectedMenuItem={onMenuSelect}
        onBackPressed={onBackPressed} />
)) as React.ComponentClass<{ history, listener }>;


export const ChatPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, history, match }: any) => (
    <div>
        <ToolbarEnhanced history={history} listener={listener} />
        <ChatPage onError={onError} location={location} router={history} params={match} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
)) as React.ComponentClass<any>;

