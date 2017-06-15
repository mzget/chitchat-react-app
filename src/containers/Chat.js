"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var flexbox_react_1 = require("flexbox-react");
var ChitchatFactory_1 = require("../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var TypingBox_1 = require("./TypingBox");
var ChatBox_1 = require("./chat/ChatBox");
var SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
var UploadingDialog_1 = require("./UploadingDialog");
var GridListSimple_1 = require("../components/GridListSimple");
var StalkBridgeActions = require("../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
var chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
var chatroomRxEpic = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
var StickerPath_1 = require("../chitchat/consts/StickerPath");
var FileType = require("../chitchat/shared/FileType");
var chatroomMessageUtils_1 = require("../actions/chatroom/chatroomMessageUtils");
var Chat = (function (_super) {
    __extends(Chat, _super);
    function Chat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.h_header = null;
        _this.h_subHeader = 34;
        _this.h_body = null;
        _this.h_typingArea = null;
        _this.clientHeight = document.documentElement.clientHeight;
        _this.chatHeight = null;
        _this.stickerBox = 204;
        _this.fileReaderChange = function (e, results) {
            results.forEach(function (result) {
                var progressEvent = result[0], file = result[1];
                console.log(file.name, file.type);
                if (file.type && file.type.length > 0) {
                    _this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
                }
                else {
                    _this.props.onError("Fail to upload file");
                }
            });
        };
        return _this;
    }
    Chat.prototype.componentWillMount = function () {
        this.state = {
            messages: new Array(),
            typingText: "",
            isLoadingEarlierMessages: false,
            earlyMessageReady: false,
            openButtomMenu: false,
            onAlert: false
        };
        this.chatHeight = this.clientHeight - (56 + 52 + 52);
        this.onSubmitTextChat = this.onSubmitTextChat.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.onSubmitStickerChat = this.onSubmitStickerChat.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);
        this.onToggleSticker = this.onToggleSticker.bind(this);
        this.fileReaderChange = this.fileReaderChange.bind(this);
        var _a = this.props, chatroomReducer = _a.chatroomReducer, userReducer = _a.userReducer, params = _a.match.params;
        if (!chatroomReducer.room) {
            this.props.dispatch(chatroomActions.getPersistendChatroom(params.room_id));
        }
        else {
            this.roomInitialize(this.props);
        }
    };
    Chat.prototype.componentWillUnmount = function () {
        this.props.dispatch(chatroomActions.leaveRoomAction());
    };
    Chat.prototype.componentWillReceiveProps = function (nextProps) {
        var chatroomReducer = nextProps.chatroomReducer, stalkReducer = nextProps.stalkReducer;
        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));
        if (!recompose_1.shallowEqual(chatroomReducer.messages, this.props.chatroomReducer.messages)) {
            this.setState(function (previousState) { return (__assign({}, previousState, { messages: chatroomReducer.messages })); }, function () {
                var chatBox = document.getElementById("app_body");
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_CONNECTION_PROBLEM:
                this.props.dispatch(chatroomActions.disableChatRoom());
                break;
            case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT:
                this.props.history.replace("/");
                break;
            default:
                break;
        }
        if (recompose_1.shallowEqual(chatroomReducer.state, this.props.chatroomReducer.state))
            return;
        switch (chatroomReducer.state) {
            case chatroomActions.JOIN_ROOM_FAILURE: {
                this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
                break;
            }
            case chatroomActions.JOIN_ROOM_SUCCESS: {
                this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
                break;
            }
            case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
                if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS: {
                if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.history.push("/");
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_FAILURE: {
                this.props.history.push("/");
                break;
            }
            case chatroomRxEpic.CHATROOM_UPLOAD_FILE_SUCCESS: {
                var responseFile = chatroomReducer.responseFile, fileInfo = chatroomReducer.fileInfo;
                if (responseFile.mimetype.match(FileType.imageType)) {
                    this.onSubmitImageChat(fileInfo, responseFile.path);
                }
                else if (responseFile.mimetype.match(FileType.videoType)) {
                    this.onSubmitVideoChat(fileInfo, responseFile.path);
                }
                else if (responseFile.mimetype.match(FileType.textType) || fileInfo.type.match(FileType.file)) {
                    this.onSubmitFile(fileInfo, responseFile);
                }
                break;
            }
            case chatroomActions.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
                // this.setMessageStatus(chatroomReducer.responseMessage.uuid, "ErrorButton");
                this.props.dispatch(chatroomActions.emptyState());
                break;
            }
            case chatroomActions.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
                this.setMessageTemp(chatroomReducer.responseMessage);
                this.props.dispatch(chatroomActions.emptyState());
                break;
            }
            case chatroomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState(function (previousState) { return (__assign({}, previousState, { earlyMessageReady: chatroomReducer.earlyMessageReady })); });
                break;
            }
            case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState(function (previousState) { return (__assign({}, previousState, { isLoadingEarlierMessages: false, earlyMessageReady: false })); });
                break;
            }
            default:
                break;
        }
    };
    Chat.prototype.onLoadEarlierMessages = function () {
        this.setState(function (previousState) { return (__assign({}, previousState, { isLoadingEarlierMessages: true })); });
        this.props.dispatch(chatroomActions.loadEarlyMessageChunk(this.props.chatroomReducer.room._id));
    };
    Chat.prototype.roomInitialize = function (props) {
        var chatroomReducer = props.chatroomReducer, userReducer = props.userReducer;
        if (!userReducer.user) {
            return this.props.dispatch(chatroomActions.leaveRoomAction());
        }
        // todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatroomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomActions.joinRoom(chatroomReducer.room._id, StalkBridgeActions.getSessionToken(), userReducer.user.username));
    };
    Chat.prototype.setMessageStatus = function (uniqueId, status) {
        var messages = [];
        var _messages = this.state.messages.slice();
        for (var i = 0; i < _messages.length; i++) {
            if (_messages[i].uuid == uniqueId) {
                var clone = Object.assign({}, _messages[i]);
                clone.status = status;
                messages.push(clone);
            }
            else {
                messages.push(_messages[i]);
            }
        }
        this.setState(__assign({}, this.state, { messages: messages }));
    };
    Chat.prototype.setMessageTemp = function (server_msg) {
        var _messages = this.state.messages.slice();
        _messages.forEach(function (message) {
            if (message.uuid == server_msg.uuid) {
                message.body = server_msg.body;
                message.createTime = server_msg.createTime;
                message.uuid = parseInt(server_msg._id);
                message.status = "Sent";
            }
        });
        this.setState(__assign({}, this.state, { messages: _messages }));
    };
    Chat.prototype.onTypingTextChange = function (event) {
        this.setState(__assign({}, this.state, { typingText: event.target.value }));
    };
    Chat.prototype.onSubmitTextChat = function () {
        if (this.state.typingText.length <= 0)
            return;
        var msg = {
            text: this.state.typingText
        };
        this.prepareSend(msg);
    };
    Chat.prototype.onSubmitImageChat = function (file, responseUrl) {
        var msg = {
            image: file.name,
            src: config().api.host + "/" + responseUrl
        };
        this.prepareSend(msg);
    };
    Chat.prototype.onSubmitVideoChat = function (file, responseUrl) {
        var msg = {
            video: file.name,
            src: config().api.host + "/" + responseUrl
        };
        this.prepareSend(msg);
    };
    Chat.prototype.onSubmitFile = function (file, responseFile) {
        var path = responseFile.path, mimetype = responseFile.mimetype, size = responseFile.size;
        var msg = {
            file: file.name,
            mimetype: mimetype,
            size: size,
            src: config().api.host + "/" + path
        };
        this.prepareSend(msg);
    };
    Chat.prototype.onSubmitStickerChat = function (id) {
        var msg = {
            sticker: id
        };
        this.onToggleSticker();
        this.prepareSend(msg);
    };
    Chat.prototype.prepareSend = function (msg) {
        var message = chatroomMessageUtils_1.decorateMessage(msg);
        this.send(message);
        var _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(function (previousState) { return (__assign({}, previousState, { typingText: "", messages: _messages })); }, function () {
            var chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    };
    Chat.prototype.send = function (message) {
        this.props.dispatch(chatroomActions.sendMessage(message));
    };
    Chat.prototype.onToggleSticker = function () {
        this.chatHeight = (this.state.openButtomMenu) ? this.chatHeight + this.stickerBox : this.chatHeight - this.stickerBox;
        this.setState(function (previousState) { return (__assign({}, previousState, { openButtomMenu: !previousState.openButtomMenu })); }, function () {
            var chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    };
    // {/*height="calc(100vh - 56px - 52px - 52px)"*/}
    Chat.prototype.render = function () {
        var _this = this;
        var _a = this.props, chatroomReducer = _a.chatroomReducer, stalkReducer = _a.stalkReducer;
        return (React.createElement(flexbox_react_1["default"], { flexDirection: "row", justifyContent: "center", id: "app_body" },
            React.createElement(flexbox_react_1["default"], { flexDirection: "column" },
                React.createElement(flexbox_react_1["default"], { flexDirection: "column" },
                    React.createElement(flexbox_react_1["default"], { flexDirection: "column", justifyContent: "flex-start", alignItems: "center", minWidth: "400px", style: { minHeight: this.chatHeight } },
                        (this.state.earlyMessageReady) ?
                            React.createElement("p", { onClick: function () { return _this.onLoadEarlierMessages(); } }, "Load Earlier Messages!")
                            :
                                null,
                        React.createElement(ChatBox_1.ChatBox, { value: this.state.messages, onSelected: function (message) { }, styles: { overflowY: "auto" } })),
                    React.createElement(flexbox_react_1["default"], null, (this.state.openButtomMenu) ?
                        React.createElement(GridListSimple_1.GridListSimple, { srcs: StickerPath_1.imagesPath, onSelected: this.onSubmitStickerChat })
                        : null)),
                React.createElement(flexbox_react_1["default"], { element: "footer", justifyContent: "center", alignContent: "stretch" },
                    React.createElement(TypingBox_1.TypingBox, { disabled: this.props.chatroomReducer.chatDisabled, onSubmit: this.onSubmitTextChat, onValueChange: this.onTypingTextChange, value: this.state.typingText, fileReaderChange: this.fileReaderChange, onSticker: this.onToggleSticker }),
                    React.createElement(UploadingDialog_1["default"], null),
                    React.createElement(SnackbarToolBox_1.SnackbarToolBox, null)))));
    };
    return Chat;
}(React.Component));
/**
 * ## Redux boilerplate
 */
var mapStateToProps = function (state) { return (__assign({}, state)); };
exports.ChatPage = react_redux_1.connect(mapStateToProps)(Chat);
