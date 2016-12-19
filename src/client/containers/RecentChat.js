var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import RecentChatItem from "./RecentChatItem";
import Store from "../redux/configureStore";
import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as ChatLogsActions from "../redux/chatlogs/chatlogsActions";
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
class ChatLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            search: ''
        };
        this.convertObjToArr = this.convertObjToArr.bind(this);
    }
    componentDidMount() {
        let { stalkReducer } = this.props.passProps;
        this.convertObjToArr(stalkReducer.chatsLog);
        // - need to get online-status of contact...
        ChatLogsActions.getContactOnlineStatus();
    }
    componentWillReceiveProps(nextProps) {
        let { chatRoomReducer, stalkReducer } = nextProps.passProps;
        if (nextProps.search != this.state.search) {
            this.setState({ search: nextProps.search }, () => {
                this.convertObjToArr(stalkReducer.chatsLog);
            });
        }
        switch (stalkReducer.state) {
            case ChatLogsActions.STALK_GET_CHATSLOG_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_UNREAD_MAP_CHANGED:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_CHATSLOG_CONTACT_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                break;
            default:
                break;
        }
        if (chatRoomReducer.state == StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS) {
            this.props.passProps.dispatch(chatroomActions.selectRoom());
            Actions.chatRoom();
        }
    }
    convertObjToArr(obj) {
        if (!obj)
            return;
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
        this.setState({ dataSource: ds.cloneWithRows(this.sortDataByLastMsg(arr)) });
    }
    sortDataByLastMsg(arr) {
        let data = arr.sort((a, b) => {
            let dateA = new Date(a.lastMessageTime);
            let dateB = new Date(b.lastMessageTime);
            if (dateA.getTime() < dateB.getTime()) {
                return 1;
            }
            if (dateA.getTime() > dateB.getTime()) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        return data;
    }
    renderChatItem(rowData) {
        return React.createElement(RecentChatItem, { data: __assign({}, rowData), onPress: onSelectChatRoom, myId: this.props.passProps.profileReducer.form.profile._id });
    }
    render() {
        return (React.createElement(View, { style: { flex: 1 } }, this.state.dataSource ?
            React.createElement(ListView, { dataSource: this.state.dataSource, renderRow: this.renderChatItem.bind(this) }) :
            null));
    }
}
export default ChatLogs;
const onSelectChatRoom = (item) => {
    Store.dispatch(StalkBridgeActions.getPrivateChatRoomId(item));
};
