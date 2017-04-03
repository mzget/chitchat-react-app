import * as React from "react";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";

import { ChatsLogComponent, ChatLogMap, IUnread, Unread } from "../../chats/chatslogComponent";
import ChatLog from "../../chats/models/chatLog";

import Store from "../../redux/configureStore";
import * as userRx from "../../redux/user/userRx";
import * as StalkBridgeActions from "../../chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../../chats/redux/chatroom/chatroomActions";
import * as ChatLogsActions from "../../chats/redux/chatlogs/chatlogsActions";
import * as ChatLogRxActions from "../../chats/redux/chatlogs/chatlogRxActions";

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
        this.convertObjToArr = this.convertObjToArr.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let { chatlogReducer } = nextProps;

        switch (chatlogReducer.state) {
            case ChatLogsActions.STALK_GET_CHATSLOG_COMPLETE:
                this.convertObjToArr(chatlogReducer.chatsLog);
                break;
            case ChatLogsActions.STALK_UNREAD_MAP_CHANGED:
                this.convertObjToArr(chatlogReducer.chatsLog);
                break;
            case ChatLogsActions.STALK_CHATLOG_CONTACT_COMPLETE:
                this.convertObjToArr(chatlogReducer.chatsLog);
                break;
            case ChatLogsActions.STALK_CHATLOG_MAP_CHANGED:
                this.convertObjToArr(chatlogReducer.chatsLog);
                break;
            default:
                break;
        }
    }

    convertObjToArr(obj: ChatLogMap) {
        if (!obj) return;

        let chatsLog = obj;

        let self = this;
        let arr = Object.keys(chatsLog).filter(function (log) {
            if (!!chatsLog[log].roomName && chatsLog[log].roomName.toLowerCase().includes(self.state.search.toLowerCase()))
                return true;
            else
                return false;
        }).map(function (key) {
            return chatsLog[key];
        });

        this.setState({ ...this.state, chatsLog: arr });
    }

    removedLog(log: ChatLog) {
        console.log("removedLog", log);

        this.props.dispatch(ChatLogRxActions.removeRoomAccess(log.id));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Recent chats</Subheader>
                <ListChatLogs
                    value={this.state.chatsLog}
                    onSelected={(data) => {
                        this.props.router.push(`/chat/${data.id}`);
                    }}
                    onRemovedLog={this.removedLog} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ chatlogReducer: state.chatlogReducer });
export const ChatLogsBoxEnhancer = connect(mapStateToProps)(ChatLogsBox);
