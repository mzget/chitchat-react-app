import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import { ChitChatFactory } from "../chitchat/chats/ChitchatFactory";
const config = () => ChitChatFactory.getInstance().config;
import { TypingBox } from "./TypingBox";
import { ChatBox } from "./chat/ChatBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import UploadingDialog from "./UploadingDialog";
import { GridListSimple } from "../components/GridListSimple";
import { MapDialog } from "./chat/MapDialog";
import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import { imagesPath } from "../chitchat/consts/StickerPath";
import * as FileType from "../chitchat/shared/FileType";
import { decorateMessage } from "../actions/chatroom/chatroomMessageUtils";
class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.h_header = null;
        this.h_subHeader = 34;
        this.h_body = null;
        this.h_typingArea = null;
        this.clientHeight = document.documentElement.clientHeight;
        this.chatHeight = null;
        this.stickerBox = 204;
        this.fileReaderChange = (e, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;
                console.log(file.name, file.type);
                if (file.type && file.type.length > 0) {
                    this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
                }
                else {
                    this.props.onError("Fail to upload file");
                }
            });
        };
        this.onSubmitTextChat = this.onSubmitTextChat.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.onSubmitStickerChat = this.onSubmitStickerChat.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);
        this.onToggleSticker = this.onToggleSticker.bind(this);
        this.fileReaderChange = this.fileReaderChange.bind(this);
        this.onLocation = this.onLocation.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onSubmitPosition = this.onSubmitPosition.bind(this);
    }
    componentWillMount() {
        this.state = {
            messages: new Array(),
            typingText: "",
            isLoadingEarlierMessages: false,
            earlyMessageReady: false,
            openButtomMenu: false,
            openMapDialog: false,
            onAlert: false
        };
        this.chatHeight = this.clientHeight - (56 + 52 + 52);
        let { chatroomReducer, userReducer, match: { params } } = this.props;
        if (!chatroomReducer.room) {
            this.props.dispatch(chatroomActions.getPersistendChatroom(params.room_id));
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
        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));
        if (!shallowEqual(chatroomReducer.messages, this.props.chatroomReducer.messages)) {
            this.setState(previousState => (Object.assign({}, previousState, { messages: chatroomReducer.messages })), () => {
                let chatBox = document.getElementById("app_body");
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
        if (shallowEqual(chatroomReducer.state, this.props.chatroomReducer.state))
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
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS: {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room))
                    this.roomInitialize(nextProps);
                break;
            }
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.history.push(`/`);
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_FAILURE: {
                this.props.history.push(`/`);
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
                break;
            }
            case chatroomActions.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
                this.setMessageTemp(chatroomReducer.responseMessage);
                break;
            }
            case chatroomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => (Object.assign({}, previousState, { earlyMessageReady: chatroomReducer.earlyMessageReady })));
                break;
            }
            case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState(previousState => (Object.assign({}, previousState, { isLoadingEarlierMessages: false, earlyMessageReady: false })));
                break;
            }
            default:
                break;
        }
    }
    onLoadEarlierMessages() {
        this.setState(previousState => (Object.assign({}, previousState, { isLoadingEarlierMessages: true })));
        this.props.dispatch(chatroomActions.loadEarlyMessageChunk(this.props.chatroomReducer.room._id));
    }
    roomInitialize(props) {
        let { chatroomReducer, userReducer } = props;
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
        this.setState(Object.assign({}, this.state, { messages: messages }));
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
        this.setState(Object.assign({}, this.state, { messages: _messages }));
    }
    onTypingTextChange(event) {
        this.setState(Object.assign({}, this.state, { typingText: event.target.value }));
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
        let message = decorateMessage(msg);
        this.send(message);
        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => (Object.assign({}, previousState, { typingText: "", messages: _messages })), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
    send(message) {
        this.props.dispatch(chatroomActions.sendMessage(message));
    }
    onToggleSticker() {
        this.chatHeight = (this.state.openButtomMenu) ? this.chatHeight + this.stickerBox : this.chatHeight - this.stickerBox;
        this.setState(previousState => (Object.assign({}, previousState, { openButtomMenu: !previousState.openButtomMenu })), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
    onLocation() {
        this.setState(previousState => (Object.assign({}, previousState, { openMapDialog: !previousState.openMapDialog })));
    }
    onLocationChange(position) {
        this.tempLocation = position;
    }
    onSubmitPosition() {
        let message = { position: this.tempLocation };
        this.tempLocation = null;
        this.onLocation();
        this.prepareSend(message);
    }
    // {/*height="calc(100vh - 56px - 52px - 52px)"*/}
    render() {
        let { chatroomReducer, stalkReducer } = this.props;
        return (React.createElement(Flexbox, { flexDirection: "row", justifyContent: "center", id: "app_body" },
            React.createElement(Flexbox, { flexDirection: "column" },
                React.createElement(Flexbox, { flexDirection: "column" },
                    React.createElement(Flexbox, { flexDirection: "column", justifyContent: "flex-start", alignItems: "center", minWidth: "400px", style: { height: this.chatHeight } },
                        (this.state.earlyMessageReady) ?
                            React.createElement("p", { onClick: () => this.onLoadEarlierMessages() }, "Load Earlier Messages!") : null,
                        React.createElement(ChatBox, { value: this.state.messages, onSelected: (message) => { }, styles: { overflowY: "auto" } }),
                        React.createElement(MapDialog, { open: this.state.openMapDialog, onClose: this.onLocation, onSubmit: this.onSubmitPosition, onLocationChange: this.onLocationChange })),
                    React.createElement(Flexbox, null, (this.state.openButtomMenu) ?
                        React.createElement(GridListSimple, { srcs: imagesPath, onSelected: this.onSubmitStickerChat })
                        : null)),
                React.createElement(Flexbox, { element: "footer", justifyContent: "center", alignContent: "stretch" },
                    React.createElement(TypingBox, { disabled: this.props.chatroomReducer.chatDisabled, onSubmit: this.onSubmitTextChat, onValueChange: this.onTypingTextChange, value: this.state.typingText, fileReaderChange: this.fileReaderChange, onSticker: this.onToggleSticker, onLocation: this.onLocation }),
                    React.createElement(UploadingDialog, null),
                    React.createElement(SnackbarToolBox, null)))));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (Object.assign({}, state));
export const ChatPage = connect(mapStateToProps)(Chat);
