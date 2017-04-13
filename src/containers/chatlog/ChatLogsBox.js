"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const Subheader_1 = require("material-ui/Subheader");
const ChatLogsActions = require("../../chitchat/chats/redux/chatlogs/chatlogsActions");
const ChatLogRxActions = require("../../chitchat/chats/redux/chatlogs/chatlogRxActions");
const ListChatLogs_1 = require("./ListChatLogs");
class ChatLogsBox extends React.Component {
    componentWillMount() {
        this.state = {
            search: "",
            chatsLog: null
        };
        this.removedLog = this.removedLog.bind(this);
        this.convertObjToArr = this.convertObjToArr.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatlogReducer } = nextProps;
        switch (chatlogReducer.state) {
            case ChatLogsActions.STALK_GET_CHATSLOG_COMPLETE:
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
        this.setState(__assign({}, this.state, { chatsLog: arr }));
    }
    removedLog(log) {
        console.log("removedLog", log);
        this.props.dispatch(ChatLogRxActions.removeRoomAccess(log.id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Recent chats"),
            React.createElement(ListChatLogs_1.ListChatLogs, { value: this.state.chatsLog, onSelected: (data) => {
                    this.props.router.push(`/chat/${data.id}`);
                }, onRemovedLog: this.removedLog })));
    }
}
exports.ChatLogsBox = ChatLogsBox;
const mapStateToProps = (state) => ({ chatlogReducer: state.chatlogReducer });
exports.ChatLogsBoxEnhancer = react_redux_1.connect(mapStateToProps)(ChatLogsBox);
