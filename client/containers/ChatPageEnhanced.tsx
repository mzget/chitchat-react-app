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
    console.log(id, value);
    let { chatroomReducer, router } = props;
    if (toolbarMenus[id] == options) {
        props.router.push(`/chat/settings/${chatroomReducer.room._id}`);
    }
};

const ToolbarEnhanced = ToolbarEnhancer(({ chatroomReducer, onMenuSelect, onBackPressed, router, listener }: any) => (
    <SimpleToolbar
        title={(chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty"}
        menus={toolbarMenus}
        onSelectedMenuItem={onMenuSelect}
        onBackPressed={onBackPressed} />
)) as React.ComponentClass<{ router, listener }>;


const ChatPageEnhanced = DialogBoxEnhancer(({ title, message, open, handleClose, onError, location, router, params }: any) => (
    <div>
        <ToolbarEnhanced router={router} listener={listener} />
        <ChatPage onError={onError} location={location} router={router} params={params} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
)) as React.ComponentClass<any>;

export const ConnectedChatPageEnhanced = ChatPageEnhanced;

