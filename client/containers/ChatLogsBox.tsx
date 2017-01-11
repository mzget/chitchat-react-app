import * as React from "react";
import { connect } from "react-redux";

import ChatsLogComponent, { ChatLogMap, IUnread, Unread } from "../chats/chatslogComponent";
import ChatLog from "../chats/models/chatLog";

import Store from "../redux/configureStore";
import * as userActions from '../redux/user/userActions';
import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as ChatLogsActions from "../redux/chatlogs/chatlogsActions";

import ListChatLogs from "./ListChatLogs";

interface IComponentNameProps {
    location: {
        query
    },
    params,
    chatroomReducer,
    stalkReducer,
    chatlogReducer
    dispatch,
    router
};

interface IComponentNameState {
    chatsLog: Array<any>,
    search
};

class ChatLogsBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            search: "", chatsLog: null
        }

        this.convertObjToArr = this.convertObjToArr.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let { chatroomReducer, stalkReducer, chatlogReducer } = nextProps;

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

        let self = this
        let arr = Object.keys(chatsLog).filter(function (log) {
            if (!!chatsLog[log].roomName && chatsLog[log].roomName.toLowerCase().includes(self.state.search.toLowerCase()))
                return true
            else
                return false
        }).map(function (key) {
            return chatsLog[key];
        });

        this.setState({ ...this.state, chatsLog: arr }, () => console.log("chatsLog convertObjToArr", this.state));
    }

    public render(): JSX.Element {
        return (<ListChatLogs value={this.state.chatsLog} onSelected={(data) => {
            this.props.router.push(`/chat/${data.id}`);
        } } />);
    }
}

export default ChatLogsBox;
