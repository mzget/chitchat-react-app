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
    chatroomReducer, stalkReducer,
    dispatch,
    router
};

interface IComponentNameState {
    chatsLog: Array<any>,
    search
};

class ChatLogs extends React.Component<IComponentNameProps, IComponentNameState> {
    constructor(props) {
        super(props);

        this.state = {
            search: "", chatsLog: null
        }

        this.convertObjToArr = this.convertObjToArr.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, stalkReducer } = nextProps;

        switch (stalkReducer.state) {
            case ChatLogsActions.STALK_GET_CHATSLOG_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                // ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_UNREAD_MAP_CHANGED:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                // ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_CHATSLOG_CONTACT_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                break;
            default:
                break;
        }

        if (chatroomReducer.state == StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS) {

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
        if (!this.state) return null;
        return (<ListChatLogs value={this.state.chatsLog} onSelected={(data) => {
            this.props.router.push(`/chat/${data.id}`);
        } } />);
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatLogs);
