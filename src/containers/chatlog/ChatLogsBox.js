import * as React from "react";
import { connect } from "react-redux";
import Subheader from "material-ui/Subheader";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as ChatLogRxActions from "../../chitchat/chats/redux/chatlogs/chatlogRxActions";
import { ListChatLogs } from "./ListChatLogs";
export class ChatLogsBox extends React.Component {
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
            React.createElement(Subheader, null, "Recent chats"),
            React.createElement(ListChatLogs, { value: this.props.chatlogReducer.chatsLog, onSelected: this.enterRoom, onRemovedLog: this.removedLog })));
    }
}
const mapStateToProps = (state) => ({
    chatlogReducer: state.chatlogReducer
});
export const ChatLogsBoxEnhancer = connect(mapStateToProps)(ChatLogsBox);
