import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import { grey50 } from "material-ui/styles/colors";
import InternalStore from "stalk-simplechat";
import * as StalkBridgeActions from "stalk-simplechat/app/redux/stalkBridge/stalkBridgeActions";
import * as chatroom from "stalk-simplechat/app/redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "stalk-simplechat/app/redux/chatroom/chatroomRxEpic";
import { TypingBox } from "./TypingBox";
import { ChatBox } from "./chat/ChatBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import UploadingDialog from "./UploadingDialog";
import { GridListSimple } from "../components/GridListSimple";
import { MapDialog } from "./chat/MapDialog";
import { imagesPath } from "../chitchat/consts/StickerPath";
import * as FileType from "../chitchat/shared/FileType";
import { decorateMessage } from "../actions/chatroom/chatroomMessageUtils";
const getConfig = () => InternalStore.apiConfig;
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
            results.forEach((result) => {
                const [progressEvent, file] = result;
                if (file.type && file.type.length > 0) {
                    this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
                }
                else {
                    this.props.onError("Can't upload unknown file type.");
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
        this.state = {
            messages: new Array(),
            typingText: "",
            isLoadingEarlierMessages: false,
            earlyMessageReady: false,
            openButtomMenu: false,
            openMapDialog: false,
            onAlert: false,
        };
        this.chatHeight = this.clientHeight - (56 + 52 + 52);
        const { chatroomReducer, userReducer, match: { params } } = this.props;
        if (!chatroomReducer.room) {
            this.props.dispatch(chatroom.getPersistendChatroom(params.room_id));
        }
        else {
            this.roomInitialize(this.props);
        }
    }
    componentDidMount() {
        this.chatBox = document.getElementById("chatbox");
    }
    componentWillUnmount() {
        this.props.dispatch(chatroom.leaveRoomAction());
    }
    componentWillReceiveProps(nextProps) {
        const { chatroomReducer, stalkReducer } = nextProps;
        this.h_subHeader = (stalkReducer.get("state") === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));
        if (!shallowEqual(chatroomReducer.get("messages"), this.props.chatroomReducer.get("messages"))) {
            this.setState((previousState) => ({
                ...previousState,
                messages: chatroomReducer.get("messages"),
            }), () => {
                this.chatBox.scrollTop = this.chatBox.scrollHeight;
            });
        }
        const prevUpload = this.props.chatroomReducer.get("uploading");
        if (chatroomReducer.get("uploading") === false && !shallowEqual(chatroomReducer.get("uploading"), prevUpload)) {
            const responseFile = chatroomReducer.get("responseFile");
            const fileInfo = chatroomReducer.get("fileInfo");
            if (responseFile.mimetype.match(FileType.imageType)) {
                this.onSubmitImageChat(responseFile.originalname, responseFile.path);
            }
            else if (responseFile.mimetype.match(FileType.videoType)) {
                this.onSubmitVideoChat(fileInfo, responseFile.path);
            }
            else if (responseFile.mimetype.match(FileType.textType) || fileInfo.type.match(FileType.file)) {
                this.onSubmitFile(fileInfo, responseFile);
            }
        }
        switch (stalkReducer.get("state")) {
            case StalkBridgeActions.STALK_CONNECTION_PROBLEM:
                this.props.dispatch(chatroom.disableChatRoom());
                break;
            case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT:
                this.props.history.replace("/");
                break;
            default:
                break;
        }
        if (shallowEqual(chatroomReducer.state, this.props.chatroomReducer.state)) {
            return;
        }
        switch (chatroomReducer.state) {
            case chatroom.GET_PERSISTEND_CHATROOM_SUCCESS: {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                    this.roomInitialize(nextProps);
                }
                break;
            }
            case chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS: {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                    this.roomInitialize(nextProps);
                }
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                    this.roomInitialize(nextProps);
                }
                break;
            }
            case chatroom.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.history.push(`/`);
                break;
            }
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_FAILURE: {
                this.props.history.push(`/`);
                break;
            }
            case chatroom.SEND_MESSAGE_FAILURE: {
                // this.setMessageStatus(chatroomReducer.responseMessage.uuid, "ErrorButton");
                break;
            }
            case chatroom.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => ({
                    ...previousState,
                    earlyMessageReady: chatroomReducer.earlyMessageReady,
                }));
                break;
            }
            case chatroom.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState((previousState) => ({
                    ...previousState,
                    isLoadingEarlierMessages: false,
                    earlyMessageReady: false,
                }));
                break;
            }
            default:
                break;
        }
    }
    onLoadEarlierMessages() {
        this.setState((previousState) => ({
            ...previousState,
            isLoadingEarlierMessages: true,
        }));
        this.props.dispatch(chatroom.loadEarlyMessageChunk(this.props.chatroomReducer.room._id));
    }
    roomInitialize(props) {
        const { chatroomReducer, userReducer, stalkReducer } = props;
        if (!userReducer.user) {
            return this.props.dispatch(chatroom.leaveRoomAction());
        }
        // todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        const room = chatroomReducer.get("room");
        chatroom.initChatRoom(room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(room._id));
        this.props.dispatch(chatroom.getChatTargetIds(room._id));
        this.props.dispatch(chatroom.joinRoom(room._id, stalkReducer.stalkToken, stalkReducer.user.username));
    }
    setMessageStatus(uniqueId, status) {
        const messages = [];
        const _messages = this.state.messages.slice();
        for (let i = 0; i < _messages.length; i++) {
            if (_messages[i].uuid === uniqueId) {
                const clone = Object.assign({}, _messages[i]);
                clone.status = status;
                messages.push(clone);
            }
            else {
                messages.push(_messages[i]);
            }
        }
        this.setState({ ...this.state, messages });
    }
    onTypingTextChange(event) {
        this.setState({ ...this.state, typingText: event.target.value });
    }
    onSubmitTextChat() {
        if (this.state.typingText.length <= 0) {
            return;
        }
        const msg = {
            text: this.state.typingText,
        };
        this.prepareSend(msg);
    }
    onSubmitImageChat(filename, responseUrl) {
        const msg = {
            image: filename,
            src: `${getConfig().host}/${responseUrl}`,
        };
        this.prepareSend(msg);
    }
    onSubmitVideoChat(file, responseUrl) {
        const msg = {
            video: file.name,
            src: `${getConfig().host}/${responseUrl}`,
        };
        this.prepareSend(msg);
    }
    onSubmitFile(file, responseFile) {
        const { path, mimetype, size } = responseFile;
        const msg = {
            file: file.name,
            mimetype,
            size,
            src: `${getConfig().host}/${path}`,
        };
        this.prepareSend(msg);
    }
    onSubmitStickerChat(id) {
        const msg = {
            sticker: id,
        };
        this.onToggleSticker();
        this.prepareSend(msg);
    }
    prepareSend(msg) {
        const message = decorateMessage(msg);
        this.send(message);
        // @ show last submit message witn sending... status.
        const _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState((previousState) => ({
            ...previousState,
            typingText: "",
            messages: _messages,
        }), () => {
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        });
    }
    send(message) {
        this.props.dispatch(chatroom.sendMessage(message));
    }
    onToggleSticker() {
        this.chatHeight = (this.state.openButtomMenu) ? this.chatHeight + this.stickerBox : this.chatHeight - this.stickerBox;
        this.setState((previousState) => ({
            ...previousState,
            openButtomMenu: !previousState.openButtomMenu,
        }));
    }
    onLocation() {
        this.setState((previousState) => ({
            ...previousState,
            openMapDialog: !previousState.openMapDialog,
        }));
    }
    onLocationChange(position) {
        this.tempLocation = position;
    }
    onSubmitPosition() {
        const message = { position: this.tempLocation };
        this.tempLocation = null;
        this.onLocation();
        this.prepareSend(message);
    }
    // {/*height="calc(100vh - 56px - 52px - 52px)"*/}
    render() {
        const { chatroomReducer, stalkReducer } = this.props;
        return (<div id={"app_body"}>
                <Flexbox flexDirection="column">
                    <Flexbox flexDirection="column">
                        <Flexbox flexDirection="column" justifyContent="flex-start" alignItems="center" minWidth="300px" style={{ height: this.chatHeight }}>
                            {(this.state.earlyMessageReady) ?
            <p onClick={() => this.onLoadEarlierMessages()}>Load Earlier Messages!</p> : null}
                            <ChatBox value={this.state.messages} onSelected={(message) => { }} styles={{ overflowY: "auto", overflowX: "hidden", backgroundColor: grey50 }}/>
                            <MapDialog open={this.state.openMapDialog} onClose={this.onLocation} onSubmit={this.onSubmitPosition} onLocationChange={this.onLocationChange}/>
                        </Flexbox>
                        <Flexbox>
                            {(this.state.openButtomMenu) ?
            <GridListSimple srcs={imagesPath} onSelected={this.onSubmitStickerChat}/>
            : null}
                        </Flexbox>
                    </Flexbox>
                    <Flexbox element="footer" justifyContent="center" alignContent="stretch">
                        <TypingBox disabled={this.props.chatroomReducer.get("chatDisabled")} onSubmit={this.onSubmitTextChat} onValueChange={this.onTypingTextChange} value={this.state.typingText} fileReaderChange={this.fileReaderChange} onSticker={this.onToggleSticker} onLocation={this.onLocation}/>
                        <UploadingDialog />
                        <SnackbarToolBox />
                    </Flexbox>
                </Flexbox>
            </div>);
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export const ChatPage = connect(mapStateToProps)(Chat);
