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
/**
 * Redux + Immutable
 */
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const config_1 = require("../configs/config");
const FileType = require("../consts/FileType");
const TypingBox_1 = require("./TypingBox");
const ChatBox_1 = require("./ChatBox");
const ToolbarSimple_1 = require("../components/ToolbarSimple");
const UploadingDialog_1 = require("./UploadingDialog");
const GridListSimple_1 = require("../components/GridListSimple");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
const chatRoomActions = require("../redux/chatroom/chatroomActions");
const chatroomRxEpic = require("../redux/chatroom/chatroomRxEpic");
const ChatDataModels_1 = require("../chats/models/ChatDataModels");
const MessageImp_1 = require("../chats/models/MessageImp");
const StickerPath_1 = require("../consts/StickerPath");
class IComponentNameProps {
}
;
;
const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;
const head = clientHeight * 0.1;
const body = clientHeight * 0.8;
const bottom = clientHeight * 0.1;
const stickersBox = clientHeight * 0.3;
class Chat extends React.Component {
    constructor() {
        super(...arguments);
        this.fileReaderChange = (e, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;
                console.dir(file);
                this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
            });
        };
    }
    componentWillMount() {
        console.log("Chat", this.props, this.state);
        this.state = {
            messages: new Array(),
            typingText: '',
            isLoadingEarlierMessages: false,
            earlyMessageReady: false,
            openButtomMenu: false,
            h_header: head,
            h_body: body,
            h_footer: bottom,
            h_chatArea: body,
            h_stickerBox: stickersBox
        };
        this.onSubmitTextMessage = this.onSubmitTextMessage.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);
        this.onToggleSticker = this.onToggleSticker.bind(this);
        let { chatroomReducer, userReducer, params } = this.props;
        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS
            || chatroomReducer.state == chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS) {
            this.roomInitialize(this.props);
        }
        if (!chatroomReducer.room) {
            this.props.dispatch(chatRoomActions.getPersistendChatroom(params.filter));
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        console.log("Chat: leaveRoom");
        this.props.dispatch(chatRoomActions.leaveRoom());
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer } = nextProps;
        switch (chatroomReducer.state) {
            case chatRoomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
                this.roomInitialize(nextProps);
                break;
            }
            case chatRoomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.router.push(`/`);
                break;
            }
            case chatRoomActions.LEAVE_ROOM_SUCCESS: {
                this.props.router.push('/');
                break;
            }
            case chatroomRxEpic.CHATROOM_UPLOAD_FILE_SUCCESS: {
                let { responseUrl, fileInfo } = chatroomReducer;
                if (fileInfo.type.match(FileType.imageType)) {
                    this.onSubmitImageMessage(fileInfo, responseUrl);
                }
                else if (fileInfo.type.match(FileType.videoType)) {
                    this.onSubmitVideoMessage(fileInfo, responseUrl);
                }
                break;
            }
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
                this.setMessageStatus(chatroomReducer.responseMessage.uuid, 'ErrorButton');
                this.props.dispatch(chatRoomActions.emptyState());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
                this.setMessageTemp(chatroomReducer.responseMessage);
                this.props.dispatch(chatRoomActions.emptyState());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_NEW_MESSAGE: {
                chatRoomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })));
                });
                this.props.dispatch(chatRoomActions.emptyState());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
                chatRoomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })));
                });
                this.props.dispatch(chatRoomActions.checkOlderMessages());
                this.props.dispatch(chatRoomActions.getNewerMessageFromNet());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
                chatRoomActions.getMessages().then(messages => {
                    this.setState(previousState => (__assign({}, previousState, { messages: messages })));
                });
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => (__assign({}, previousState, { earlyMessageReady: chatroomReducer.earlyMessageReady })));
                break;
            }
            case chatRoomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
                chatRoomActions.getMessages().then(messages => {
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
        this.props.dispatch(chatRoomActions.loadEarlyMessageChunk());
    }
    roomInitialize(props) {
        let { chatroomReducer, userReducer, params } = props;
        if (!userReducer.user) {
            return this.props.dispatch(chatRoomActions.leaveRoom());
        }
        //@ todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatRoomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
        this.props.dispatch(chatRoomActions.joinRoom(chatroomReducer.room._id, StalkBridgeActions.getSessionToken(), userReducer.user.username));
    }
    setMessageStatus(uniqueId, status) {
        let messages = [];
        let _messages = this.state.messages.slice();
        for (let i = 0; i < _messages.length; i++) {
            if (_messages[i].uuid === uniqueId) {
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
        console.log("server_response_msg", server_msg);
        if (!server_msg.uuid)
            return;
        let _messages = this.state.messages.slice();
        _messages.forEach((message) => {
            if (message.uuid == server_msg.uuid) {
                message.createTime = server_msg.createTime;
                message.uuid = server_msg.messageId;
                message.status = "Sent";
            }
        });
        this.setState(__assign({}, this.state, { messages: _messages }));
    }
    onTypingTextChange(event) {
        this.setState(__assign({}, this.state, { typingText: event.target.value }));
    }
    onSubmitTextMessage() {
        if (this.state.typingText.length <= 0)
            return;
        let msg = {
            text: this.state.typingText
        };
        let message = this.prepareSendMessage(msg);
        this.send(message);
        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => (__assign({}, previousState, { typingText: "", messages: _messages })));
    }
    onSubmitImageMessage(file, responseUrl) {
        let msg = {
            image: file.name,
            src: `${config_1.default.api.host}/${responseUrl}`
        };
        this.prepareSend(msg);
    }
    onSubmitVideoMessage(file, responseUrl) {
        let msg = {
            video: file.name,
            src: `${config_1.default.api.host}/${responseUrl}`
        };
        this.prepareSend(msg);
    }
    prepareSend(msg) {
        let message = this.prepareSendMessage(msg);
        this.send(message);
        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => (__assign({}, previousState, { typingText: "", messages: _messages })));
    }
    prepareSendMessage(msg) {
        let message = new MessageImp_1.MessageImp();
        if (msg.image) {
            message.body = msg.image;
            message.src = msg.src;
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image];
        }
        else if (msg.text) {
            message.body = msg.text;
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text];
        }
        else if (msg.location) {
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location];
        }
        else if (msg.video) {
            message.body = msg.video;
            message.src = msg.src;
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Video];
        }
        message.rid = this.props.chatroomReducer.room._id;
        message.sender = this.props.userReducer.user._id;
        message.user = {
            _id: this.props.userReducer.user._id,
            username: this.props.userReducer.user.username,
            avatar: this.props.userReducer.user.avatar
        };
        message.target = "*";
        message.uuid = Math.round(Math.random() * 10000); // simulating server-side unique id generation
        message.status = 'Sending...';
        return message;
    }
    send(message) {
        this.props.dispatch(chatRoomActions.sendMessage(message));
    }
    onToggleSticker() {
        this.setState(previousState => (__assign({}, previousState, { openButtomMenu: !previousState.openButtomMenu, h_chatArea: (previousState.openButtomMenu) ? body : body - previousState.h_stickerBox })));
    }
    render() {
        let { chatroomReducer } = this.props;
        return (React.createElement("div", { style: { height: document.documentElement.clientHeight } },
            React.createElement("div", { style: { height: this.state.h_header } },
                React.createElement(reflexbox_1.Flex, { flexAuto: true },
                    React.createElement(ToolbarSimple_1.default, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "" }))),
            React.createElement("div", { style: { height: this.state.h_body } },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement("div", { style: { height: this.state.h_chatArea, overflowY: 'scroll' } },
                        (this.state.earlyMessageReady) ?
                            React.createElement(reflexbox_1.Flex, { align: 'center', justify: 'center' },
                                React.createElement("p", { onClick: () => this.onLoadEarlierMessages() }, "Load Earlier Messages!"))
                            :
                                null,
                        React.createElement(ChatBox_1.default, __assign({}, this.props, { value: this.state.messages, onSelected: (message) => {
                            } })))),
                (this.state.openButtomMenu) ?
                    React.createElement(GridListSimple_1.default, { boxHeight: this.state.h_stickerBox, srcs: StickerPath_1.imagesPath, onSelected: (id) => {
                            console.log("stickers :", id);
                        } })
                    : null),
            React.createElement(reflexbox_1.Flex, { align: 'center', justify: 'center', flexColumn: false },
                React.createElement("div", { style: { bottom: '0%', position: 'absolute' } },
                    React.createElement(TypingBox_1.TypingBox, { onSubmit: this.onSubmitTextMessage, onValueChange: this.onTypingTextChange, value: this.state.typingText, fileReaderChange: this.fileReaderChange, onSticker: this.onToggleSticker }))),
            React.createElement(UploadingDialog_1.default, null)));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Chat);
