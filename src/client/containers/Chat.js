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
const TypingBox_1 = require("./TypingBox");
const ChatBox_1 = require("./ChatBox");
const ToolbarSimple_1 = require("../components/ToolbarSimple");
const UploadingDialog_1 = require("./UploadingDialog");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
const chatRoomActions = require("../redux/chatroom/chatroomActions");
const chatroomRxEpic = require("../redux/chatroom/chatroomRxEpic");
const ChatDataModels_1 = require("../chats/models/ChatDataModels");
const MessageImp_1 = require("../chats/models/MessageImp");
class IComponentNameProps {
}
;
;
class Chat extends React.Component {
    constructor() {
        super(...arguments);
        this.fileReaderChange = (e, results) => {
            const textType = /text.*/;
            const imageType = /image.*/;
            results.forEach(result => {
                const [progressEvent, file] = result;
                let body = new FormData();
                body.append('file', file);
                console.dir(progressEvent);
                console.dir(file);
                /*
                if (file.type.match(imageType)) {
                    let msg = {
                        image: file.name,
                        src: file
                    };
                    let message = this.prepareSendMessage(msg);
                    // this.send(message);
                    let _messages = this.state.messages.slice();
                    _messages.push(message);
                    this.setState(previousState => ({ ...previousState, typingText: "", messages: _messages }));
                }
    */
                this.props.dispatch(chatroomRxEpic.uploadFile(body, progressEvent));
            });
        };
    }
    componentWillMount() {
        console.log("Chat", this.props, this.state);
        this.state = {
            messages: [],
            typingText: '',
            isLoadingEarlierMessages: false,
            earlyMessageReady: false
        };
        this.onSubmitMessage = this.onSubmitMessage.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);
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
                let { responseUrl } = chatroomReducer;
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
                this.onReceive(chatroomReducer.newMessage);
                this.props.dispatch(chatRoomActions.emptyState());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
                this.setInitMessages(chatRoomActions.getMessages());
                this.props.dispatch(chatRoomActions.checkOlderMessages());
                this.props.dispatch(chatRoomActions.getNewerMessageFromNet());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
                this.setInitMessages(chatRoomActions.getMessages());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => (__assign({}, previousState, { earlyMessageReady: chatroomReducer.earlyMessageReady })));
                break;
            }
            case chatRoomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState(previousState => (__assign({}, previousState, { isLoadingEarlierMessages: false, earlyMessageReady: false })));
                this.setInitMessages(chatRoomActions.getMessages());
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
    onReceive(message) {
        let messageImp = __assign({}, message);
        let _temp = this.state.messages.slice();
        StalkBridgeActions.getUserInfo(message.sender, (result) => {
            if (result) {
                messageImp.user = {
                    _id: result._id,
                    username: result.displayname,
                    avatar: result.image
                };
                _temp.push(message);
                this.setState((previousState) => (__assign({}, previousState, { messages: _temp })));
            }
            else {
                _temp.push(message);
                this.setState((previousState) => (__assign({}, previousState, { messages: _temp })));
            }
        });
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
    setInitMessages(messages) {
        this.setState((previousState) => { return __assign({}, previousState, { messages: messages }); });
    }
    onTypingTextChange(event) {
        this.setState(__assign({}, this.state, { typingText: event.target.value }));
    }
    onSubmitMessage() {
        if (this.state.typingText.length <= 0)
            return;
        let msg = {
            text: this.state.typingText
        };
        let message = this.prepareSendMessage(msg);
        this.send(message);
        let _messages = this.state.messages.slice();
        _messages.push(message);
        this.setState(previousState => (__assign({}, previousState, { typingText: "", messages: _messages })));
    }
    prepareSendMessage(msg) {
        let message = new MessageImp_1.MessageImp();
        if (msg.image) {
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image];
        }
        else if (msg.text) {
            message.body = msg.text;
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text];
        }
        else if (msg.location) {
            message.type = ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location];
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
    render() {
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        let head = clientHeight * 0.1;
        let body = clientHeight * 0.8;
        let bottom = clientHeight * 0.1;
        let { chatroomReducer } = this.props;
        return (React.createElement("div", { style: { height: clientHeight } },
            React.createElement("div", { style: { height: head } },
                React.createElement(reflexbox_1.Flex, { flexAuto: true },
                    React.createElement(ToolbarSimple_1.default, { title: (chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "" }))),
            React.createElement("div", { style: { height: body } },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement("div", { style: { height: body, overflowY: 'scroll' } },
                        (this.state.earlyMessageReady) ?
                            React.createElement(reflexbox_1.Flex, { align: 'center', justify: 'center' },
                                React.createElement("p", { onClick: () => this.onLoadEarlierMessages() }, "Load Earlier Messages!"))
                            :
                                null,
                        React.createElement(ChatBox_1.default, __assign({}, this.props, { value: this.state.messages, onSelected: (message) => {
                            } }))))),
            React.createElement("div", { style: { height: bottom } },
                React.createElement(reflexbox_1.Flex, { align: 'center', justify: 'center', flexColumn: false },
                    React.createElement("div", { style: { bottom: '0%', position: 'absolute' } },
                        React.createElement(TypingBox_1.TypingBox, { onSubmit: this.onSubmitMessage, onValueChange: this.onTypingTextChange, value: this.state.typingText, fileReaderChange: this.fileReaderChange })))),
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
