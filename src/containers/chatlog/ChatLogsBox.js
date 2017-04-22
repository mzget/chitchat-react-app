"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const Subheader_1 = require("material-ui/Subheader");
const chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
const ChatLogRxActions = require("../../chitchat/chats/redux/chatlogs/chatlogRxActions");
const ListChatLogs_1 = require("./ListChatLogs");
class ChatLogsBox extends React.Component {
    componentWillMount() {
        this.state = {
            search: "",
            chatsLog: null
        };
        this.removedLog = this.removedLog.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }
    removedLog(log) {
        console.log("removedLog", log);
        this.props.dispatch(ChatLogRxActions.removeRoomAccess(log.id));
    }
    enterRoom(data) {
        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() => this.props.dispatch(chatroomActions.getPersistendChatroom(data.id)));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Recent chats"),
            React.createElement(ListChatLogs_1.ListChatLogs, { value: this.props.chatlogReducer.chatsLog, onSelected: this.enterRoom, onRemovedLog: this.removedLog })));
    }
}
exports.ChatLogsBox = ChatLogsBox;
const mapStateToProps = (state) => ({ chatlogReducer: state.chatlogReducer });
exports.ChatLogsBoxEnhancer = react_redux_1.connect(mapStateToProps)(ChatLogsBox);
