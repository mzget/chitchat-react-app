import * as React from "react";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";

import { ChatsLogComponent, ChatLogMap, IUnread, Unread } from "../../chitchat/chats/chatslogComponent";
import ChatLog from "../../chitchat/chats/models/chatLog";

import Store from "../../redux/configureStore";
import * as userRx from "../../redux/user/userRx";
import * as StalkBridgeActions from "../../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as ChatLogsActions from "../../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as ChatLogRxActions from "../../chitchat/chats/redux/chatlogs/chatlogRxActions";

import { ListChatLogs } from "./ListChatLogs";

interface IComponentNameProps {
    location: {
        query
    };
    params;
    chatlogReducer;
    dispatch;
    router;
}

interface IComponentNameState {
    chatsLog: Array<any>;
    search;
}

export class ChatLogsBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            search: "",
            chatsLog: null
        };

        this.removedLog = this.removedLog.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }

    removedLog(log: ChatLog) {
        console.log("removedLog", log);

        this.props.dispatch(ChatLogRxActions.removeRoomAccess(log.id));
    }

    enterRoom(data) {
        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() =>
            this.props.dispatch(chatroomActions.getPersistendChatroom(data.id)));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Recent chats</Subheader>
                <ListChatLogs
                    value={this.props.chatlogReducer.chatsLog}
                    onSelected={this.enterRoom}
                    onRemovedLog={this.removedLog} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    chatlogReducer: state.chatlogReducer,
    history: state.history
});
export const ChatLogsBoxEnhancer = connect(mapStateToProps)(ChatLogsBox);
