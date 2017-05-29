"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_redux_1 = require("react-redux");
var Subheader_1 = require("material-ui/Subheader");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var ChatLogRxActions = require("../../chitchat/chats/redux/chatlogs/chatlogRxActions");
var ListChatLogs_1 = require("./ListChatLogs");
var ChatLogsBox = (function (_super) {
    __extends(ChatLogsBox, _super);
    function ChatLogsBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatLogsBox.prototype.componentWillMount = function () {
        this.state = {
            search: "",
            chatsLog: null
        };
        this.removedLog = this.removedLog.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    };
    ChatLogsBox.prototype.removedLog = function (log) {
        console.log("removedLog", log);
        this.props.dispatch(ChatLogRxActions.removeRoomAccess(log.id));
    };
    ChatLogsBox.prototype.enterRoom = function (data) {
        var _this = this;
        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(function () {
            return _this.props.dispatch(chatroomActions.getPersistendChatroom(data.id));
        });
    };
    ChatLogsBox.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Subheader_1["default"], null, "Recent chats"),
            React.createElement(ListChatLogs_1.ListChatLogs, { value: this.props.chatlogReducer.chatsLog, onSelected: this.enterRoom, onRemovedLog: this.removedLog })));
    };
    return ChatLogsBox;
}(React.Component));
exports.ChatLogsBox = ChatLogsBox;
var mapStateToProps = function (state) { return ({
    chatlogReducer: state.chatlogReducer
}); };
exports.ChatLogsBoxEnhancer = react_redux_1.connect(mapStateToProps)(ChatLogsBox);
