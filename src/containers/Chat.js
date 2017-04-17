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
const reflexbox_1 = require("reflexbox");
const Colors = require("material-ui/styles/colors");
const chitchatFactory_1 = require("../chitchat/chats/chitchatFactory");
const config = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const TypingBox_1 = require("./TypingBox");
const ChatBox_1 = require("./chat/ChatBox");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const UploadingDialog_1 = require("./UploadingDialog");
const GridListSimple_1 = require("../components/GridListSimple");
const WarningBar_1 = require("../components/WarningBar");
const ChatRoomDialogBoxEnhancer_1 = require("./toolsbox/ChatRoomDialogBoxEnhancer");
const StalkBridgeActions = require("../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const chatroomRxEpic = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
const StickerPath_1 = require("../chitchat/consts/StickerPath");
const FileType = require("../chitchat/libs/shared/FileType");
const chatroomMessageUtils_1 = require("../actions/chatroom/chatroomMessageUtils");
class Chat extends React.Component {
    constructor() {
        super(...arguments);
        this.options = "Options";
        this.favorite = "Favorite";
        this.toolbarMenus = [this.options, this.favorite];
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.h_header = null;
        this.h_subHeader = 34;
        this.h_body = null;
        this.h_typingArea = null;
        this.bottom = this.clientHeight * 0.1;
        this.h_stickerBox = this.clientHeight * 0.3;
        this.alertTitle = "";
        this.alertMessage = "";
        this.fileReaderChange = (e, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;
                console.log(file.name, file.type);
                if (file.type && file.type.length > 0) {
                    this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
                }
                else {
                    this.alertTitle = "Alert!";
                    this.alertMessage = "Fail to upload file";
                    this.setState({ onAlert: true });
                }
            });
        };
    }
    componentWillMount() {
        this.state = {
            messages: new Array(),
            typingText: "",
            isLoadingEarlierMessages: false,
            earlyMessageReady: false,
            openButtomMenu: false,
            onAlert: false
        };
        this.onSubmitTextChat = this.onSubmitTextChat.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.onSubmitStickerChat = this.onSubmitStickerChat.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);
        this.onToggleSticker = this.onToggleSticker.bind(this);
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onMenuSelect = this.onMenuSelect.bind(this);
        let { chatroomReducer, userReducer, params } = this.props;
        if (!chatroomReducer.room) {
            this.props.dispatch(chatroomActions.getPersistendChatroom(params.filter));
        }
        else {
            this.roomInitialize(this.props);
        }
    }
    componentWillUnmount() {
        this.props.dispatch(chatroomActions.leaveRoomAction());
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, stalkReducer } = nextProps;
        let warning_bar = document.getElementById("warning_bar");
        let typing_box = document.getElementById("typing_box");
        this.h_header = document.getElementById("toolbar").clientHeight;
        this.h_typingArea = typing_box.clientHeight;
        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));
        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_CONNECTION_PROBLEM:
                this.props.dispatch(chatroomActions.disableChatRoom());
                break;
            case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT:
                this.props.router.replace("/");
                break;
            default:
                break;
        }
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
                this.roomInitialize(nextProps);
                break;
            }
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.router.push(`/`);
                break;
            }
            case chatroomRxEpic.CHATROOM_UPLOAD_FILE_SUCCESS: {
                let { responseFile, fileInfo } = chatroomReducer;
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
            case chatroomActions.ChatRoomActionsType.ON_NEW_MESSAGE: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })), () => {
                        let chatBox = document.getElementById("app_body");
                        chatBox.scrollTop = chatBox.scrollHeight;
                    });
                });
                this.props.dispatch(chatroomActions.emptyState());
                break;
            }
            case chatroomRxEpic.GET_PERSISTEND_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })));
                });
                this.props.dispatch(chatroomActions.checkOlderMessages());
                this.props.dispatch(chatroomActions.getNewerMessageFromNet());
                break;
            }
            case chatroomActions.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })));
                });
                break;
            }
            case chatroomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => (__assign({}, previousState, { earlyMessageReady: chatroomReducer.earlyMessageReady })));
                break;
            }
            case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { isLoadingEarlierMessages: false, earlyMessageReady: false, messages: messages })));
                });
                break;
            }
            default:
                break;
        }
    }
    onLoadEarlierMessages() {
        this.setState(previousState => (__assign({}, previousState, { isLoadingEarlierMessages: true })));
        this.props.dispatch(chatroomActions.loadEarlyMessageChunk());
    }
    roomInitialize(props) {
        let { chatroomReducer, userReducer, params } = props;
        if (!userReducer.user) {
            return this.props.dispatch(chatroomActions.leaveRoomAction());
        }
        // todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatroomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomActions.joinRoom(chatroomReducer.room._id, StalkBridgeActions.getSessionToken(), userReducer.user.username));
    }
    setMessageStatus(uniqueId, status) {
        let messages = [];
        let _messages = this.state.messages.slice();
        for (let i = 0; i < _messages.length; i++) {
            if (_messages[i].uuid == uniqueId) {
                let clone = Object.assign({}, _messages[i]);
                clone.status = status;
                messages.push(clone);
            }
            else {
                messages.push(_messages[i]);
            }
        }
        this.setState(__assign({}, this.state, { messages: messages }));
    }
    setMessageTemp(server_msg) {
        let _messages = this.state.messages.slice();
        _messages.forEach((message) => {
            if (message.uuid == server_msg.uuid) {
                message.body = server_msg.body;
                message.createTime = server_msg.createTime;
                message.uuid = parseInt(server_msg._id);
                message.status = "Sent";
            }
        });
        this.setState(__assign({}, this.state, { messages: _messages }));
    }
    onTypingTextChange(event) {
        this.setState(__assign({}, this.state, { typingText: event.target.value }));
    }
    onSubmitTextChat() {
        if (this.state.typingText.length <= 0)
            return;
        let msg = {
            text: this.state.typingText
        };
        this.prepareSend(msg);
    }
    onSubmitImageChat(file, responseUrl) {
        let msg = {
            image: file.name,
            src: `${config().api.host}/${responseUrl}`
        };
        this.prepareSend(msg);
    }
    onSubmitVideoChat(file, responseUrl) {
        let msg = {
            video: file.name,
            src: `${config().api.host}/${responseUrl}`
        };
        this.prepareSend(msg);
    }
    onSubmitFile(file, responseFile) {
        let { path, mimetype, size } = responseFile;
        let msg = {
            file: file.name,
            mimetype: mimetype,
            size: size,
            src: `${config().api.host}/${path}`
        };
        this.prepareSend(msg);
    }
    onSubmitStickerChat(id) {
        let msg = {
            sticker: id
        };
        this.onToggleSticker();
        this.prepareSend(msg);
    }
    prepareSend(msg) {
        let message = chatroomMessageUtils_1.decorateMessage(msg);
        this.send(message);
        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => (__assign({}, previousState, { typingText: "", messages: _messages })), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
    send(message) {
        this.props.dispatch(chatroomActions.sendMessage(message));
    }
    onToggleSticker() {
        this.h_body = (this.state.openButtomMenu) ? this.h_body + this.h_stickerBox : this.h_body - this.h_stickerBox;
        this.setState(previousState => (__assign({}, previousState, { openButtomMenu: !previousState.openButtomMenu })), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
    onBackPressed() {
        this.props.router.goBack();
    }
    onMenuSelect(id, value) {
        let { chatroomReducer } = this.props;
        console.log(id, value);
        if (this.toolbarMenus[id] == this.options) {
            this.props.router.push(`/chat/settings/${chatroomReducer.room._id}`);
        }
    }
    render() {
        let { chatroomReducer, stalkReducer } = this.props;
        return (React.createElement("div", { style: { overflowY: "hidden" } },
            React.createElement("div", { style: { height: this.h_header }, id: "toolbar" },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty", menus: this.toolbarMenus, onSelectedMenuItem: this.onMenuSelect, onBackPressed: this.onBackPressed })),
            (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
                React.createElement(WarningBar_1.WarningBar, null) : null,
            React.createElement("div", { style: { height: this.h_body, overflowY: "auto", backgroundColor: Colors.indigo50 }, id: "app_body" },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    (this.state.earlyMessageReady) ?
                        React.createElement(reflexbox_1.Flex, { align: "center", justify: "center" },
                            React.createElement("p", { onClick: () => this.onLoadEarlierMessages() }, "Load Earlier Messages!"))
                        :
                            null,
                    React.createElement(ChatBox_1.ChatBox, { styles: { width: this.clientWidth, overflowX: "hidden" }, value: this.state.messages, onSelected: (message) => { } }))),
            (this.state.openButtomMenu) ?
                React.createElement(GridListSimple_1.default, { boxHeight: this.h_stickerBox, srcs: StickerPath_1.imagesPath, onSelected: this.onSubmitStickerChat })
                : null,
            React.createElement(TypingBox_1.TypingBox, { styles: { width: this.clientWidth }, disabled: this.props.chatroomReducer.chatDisabled, onSubmit: this.onSubmitTextChat, onValueChange: this.onTypingTextChange, value: this.state.typingText, fileReaderChange: this.fileReaderChange, onSticker: this.onToggleSticker }),
            React.createElement(ChatRoomDialogBoxEnhancer_1.ChatRoomDialogBoxEnhancer, { title: this.alertTitle, message: this.alertMessage, open: this.state.onAlert, handleClose: () => this.setState({ onAlert: !this.state.onAlert }) }),
            React.createElement(UploadingDialog_1.default, null),
            React.createElement(SnackbarToolBox_1.SnackbarToolBox, null)));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Chat);
