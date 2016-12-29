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
const async = require("async");
const react_layout_components_1 = require("react-layout-components");
const Messages_1 = require("chat-template/dist/Messages");
const TypingBox_1 = require("./TypingBox");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
const chatRoomActions = require("../redux/chatroom/chatroomActions");
const chatroomRxEpic = require("../redux/chatroom/chatroomRxEpic");
const ChatDataModels_1 = require("../chats/models/ChatDataModels");
class IComponentNameProps {
}
;
;
// var messages = [{
//     message: 'How do I use this messaging app?',
//     from: 'right',
//     backColor: '#3d83fa',
//     textColor: "white",
//     avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
//     duration: 2000,
//     inbound: false
// }];
class IGiftedChat {
    constructor() {
        this.backColor = '#3d83fa';
        this.textColor = "white";
    }
}
class Chat extends React.Component {
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
        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS || chatroomReducer.state == chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS) {
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
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
                this.setMessageStatus(chatroomReducer.responseMessage.uuid, 'ErrorButton');
                this.props.dispatch(chatRoomActions.stop());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
                this.setMessageTemp(chatroomReducer.responseMessage);
                this.props.dispatch(chatRoomActions.stop());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_NEW_MESSAGE: {
                this.onReceive(chatroomReducer.newMessage);
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
        //@ todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatRoomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
        this.props.dispatch(chatRoomActions.joinRoom(chatroomReducer.room._id, StalkBridgeActions.getSessionToken(), userReducer.user.username));
    }
    onReceive(message) {
        let _message = new IGiftedChat();
        _message = __assign({}, message);
        console.log("onReceive: ", _message);
        StalkBridgeActions.getUserInfo(message.sender, (result) => {
            _message.inbound = true;
            // _message.backColor = 
            if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text])
                _message.message = message.body;
            else if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image])
                message.image = message.body;
            else if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location])
                message.location = message.body;
            if (result) {
                message.user = {
                    _id: result._id,
                    name: result.displayname,
                    avatar: result.image
                };
                this.setState((previousState) => {
                    return __assign({ messages: previousState.messages }, previousState);
                });
            }
            else {
                let _temp = this.state.messages.slice();
                _temp.push(_message);
                this.setState((previousState) => {
                    return __assign({}, previousState, { messages: _temp });
                });
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
        async.mapSeries(messages, (message, resultCB) => {
            resultCB(null, this.setGiftMessage(message));
        }, (err, results) => {
            // append the message...
            this.setState((previousState) => { return __assign({}, previousState, { messages: results }); }, () => {
                console.log("Map completed: ", this.state.messages.length);
            });
        });
    }
    setGiftMessage(message) {
        let myProfile = this.props.userReducer.user;
        let msg = new IGiftedChat();
        msg.type = message.type;
        msg._id = message._id;
        msg.rid = message.rid;
        msg.sender = message.sender;
        msg.target = message.target;
        //@ Is my message.
        if (msg.sender == myProfile._id) {
            msg.inbound = false;
        }
        else {
            msg.inbound = true;
        }
        if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
            msg.message = message.body;
        }
        else if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]) {
            msg.image = message.body;
        }
        else if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Location]) {
            msg.location = message.body;
        }
        else {
            msg.message = message.body;
        }
        return msg;
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
        this.sendText(message);
        let _messages = this.state.messages.slice();
        let gift = this.setGiftMessage(message);
        gift.status = 'Sending...';
        _messages.push(gift);
        this.setState(__assign({}, this.state, { typingText: "", messages: _messages }));
    }
    render() {
        return (React.createElement(react_layout_components_1.Box, { column: true, flex: "1 0 auto" },
            (this.state.earlyMessageReady) ?
                React.createElement(react_layout_components_1.Container, { alignSelf: 'center', style: {} },
                    React.createElement("p", { onClick: () => this.onLoadEarlierMessages() }, "Load Earlier Messages!"))
                :
                    null,
            React.createElement(react_layout_components_1.Box, { flex: "1 0 auto", alignItems: "stretch" }, (this.state) ? React.createElement(Messages_1.default, { messages: this.state.messages, styles: { container: { position: '', bottom: '' } } }) : null),
            React.createElement(react_layout_components_1.Container, { alignSelf: 'center', style: { bottom: '0%', position: 'absolute' } },
                React.createElement(TypingBox_1.TypingBox, { onSubmit: this.onSubmitMessage, onValueChange: this.onTypingTextChange, value: this.state.typingText }))));
    }
    prepareSendMessage(msg) {
        let message = {};
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
        message.target = "*";
        message.uuid = Math.round(Math.random() * 10000); // simulating server-side unique id generation
        return message;
    }
    sendText(message) {
        this.props.dispatch(chatRoomActions.sendMessage(message));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}
function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, __assign({}, stateProps, dispatchProps));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat);
