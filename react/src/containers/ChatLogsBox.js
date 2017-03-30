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
const immutable = require("immutable");
const Subheader_1 = require("material-ui/Subheader");
const ChatLogsActions = require("../chats/redux/chatlogs/chatlogsActions");
const ListChatLogs_1 = require("./ListChatLogs");
;
;
class ChatLogsBox extends React.Component {
    componentWillMount() {
        this.state = {
            search: "",
            chatsLog: null
        };
        this.convertObjToArr = this.convertObjToArr.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, stalkReducer, chatlogReducer } = nextProps;
        let prevChatlogs = immutable.fromJS(this.props.chatlogReducer.chatsLog);
        let nextChatlogs = immutable.fromJS(chatlogReducer.chatsLog);
        if (!!nextChatlogs && !nextChatlogs.equals(prevChatlogs)) {
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
        this.setState(__assign({}, this.state, { chatsLog: arr }), () => console.log("chatsLog convertObjToArr", this.state));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Recent chats"),
            React.createElement(ListChatLogs_1.default, { value: this.state.chatsLog, onSelected: (data) => {
                    this.props.router.push(`/chat/${data.id}`);
                } })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatLogsBox;
