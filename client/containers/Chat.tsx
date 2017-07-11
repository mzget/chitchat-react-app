import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import * as async from "async";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";

import { ChitChatFactory } from "../chitchat/chats/ChitChatFactory";
const config = () => ChitChatFactory.getInstance().config;

import { TypingBox } from "./TypingBox";
import { ChatBox } from "./chat/ChatBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import UploadingDialog from "./UploadingDialog";
import { GridListSimple } from "../components/GridListSimple";
import { MapBox } from "./chat/MapBox";
import { MapDialog } from "./chat/MapDialog";
import { Point } from "./chat/MapBox";

import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroom from "../chitchat/chats/redux/chatroom/";
import { ChatRoomRecoder } from "../chitchat/chats/redux/chatroom/";
import * as chatroomRxEpic from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import { MessageType, IMessage } from "../chitchat/shared/Message";
import { MessageImp } from "../chitchat/chats/models/MessageImp";
import { imagesPath } from "../chitchat/consts/StickerPath";
import * as FileType from "../chitchat/shared/FileType";

import { decorateMessage, IMessageDecorator } from "../actions/chatroom/chatroomMessageUtils";
import { IComponentProps } from "../utils/IComponentProps";

interface IComponentNameState {
    messages: any[];
    isLoadingEarlierMessages;
    typingText: string;
    earlyMessageReady;
    openButtomMenu: boolean;
    openMapDialog: boolean;
    onAlert: boolean;
}

class Chat extends React.Component<IComponentProps, IComponentNameState> {
    h_header = null;
    h_subHeader = 34;
    h_body = null;
    h_typingArea = null;
    clientHeight = document.documentElement.clientHeight;
    chatHeight = null;
    stickerBox = 204;
    tempLocation: Point;
    chatBox: HTMLElement;

    constructor(props) {
        super(props);

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
            onAlert: false
        };

        this.chatHeight = this.clientHeight - (56 + 52 + 52);

        let { chatroomReducer, userReducer, match: { params } } = this.props;

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

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, stalkReducer } = nextProps;

        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));

        if (!shallowEqual(chatroomReducer.messages, this.props.chatroomReducer.messages)) {
            this.setState(previousState => ({
                ...previousState,
                messages: chatroomReducer.messages
            }), () => {
                this.chatBox.scrollTop = this.chatBox.scrollHeight;
            });
        }

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_CONNECTION_PROBLEM:
                this.props.dispatch(chatroom.disableChatRoom());
                break;
            case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT:
                this.props.history.replace("/");
                break;
            default:
                break;
        }

        if (shallowEqual(chatroomReducer.state, this.props.chatroomReducer.state)) return;
        switch (chatroomReducer.state) {
            case chatroom.GET_PERSISTEND_CHATROOM_SUCCESS: {
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
            case chatroom.GET_PERSISTEND_CHATROOM_FAILURE: {
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

            case chatroom.SEND_MESSAGE_FAILURE: {
                // this.setMessageStatus(chatroomReducer.responseMessage.uuid, "ErrorButton");
                break;
            }
            case chatroom.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => ({
                    ...previousState,
                    earlyMessageReady: chatroomReducer.earlyMessageReady
                }));

                break;
            }
            case chatroom.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState(previousState => ({
                    ...previousState,
                    isLoadingEarlierMessages: false,
                    earlyMessageReady: false
                }));
                break;
            }
            default:
                break;
        }
    }

    onLoadEarlierMessages() {
        this.setState(previousState => ({
            ...previousState,
            isLoadingEarlierMessages: true,
        }));

        this.props.dispatch(chatroom.loadEarlyMessageChunk(this.props.chatroomReducer.room._id));
    }

    roomInitialize(props: IComponentProps) {
        let { chatroomReducer, userReducer }: { chatroomReducer: ChatRoomRecoder, userReducer: any } = props;
        if (!userReducer.user) {
            return this.props.dispatch(chatroom.leaveRoomAction());
        }

        // todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        let room = chatroomReducer.get("room");
        chatroom.initChatRoom(room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(room._id));
        this.props.dispatch(chatroom.getChatTargetIds(room._id));
    }

    setMessageStatus(uniqueId, status) {
        let messages = [];
        let _messages = this.state.messages.slice();

        for (let i = 0; i < _messages.length; i++) {
            if (_messages[i].uuid == uniqueId) {
                let clone = Object.assign({}, _messages[i]);
                clone.status = status;
                messages.push(clone);
            } else {
                messages.push(_messages[i]);
            }
        }

        this.setState({ ...this.state, messages: messages });
    }

    onTypingTextChange(event) {
        this.setState({ ...this.state, typingText: event.target.value });
    }

    onSubmitTextChat() {
        if (this.state.typingText.length <= 0) return;

        let msg = {
            text: this.state.typingText
        };

        this.prepareSend(msg);
    }

    onSubmitImageChat(file: File, responseUrl: string) {
        let msg = {
            image: file.name,
            src: `${config().api.host}/${responseUrl}`
        };

        this.prepareSend(msg);
    }

    onSubmitVideoChat(file: File, responseUrl: string) {
        let msg = {
            video: file.name,
            src: `${config().api.host}/${responseUrl}`
        };

        this.prepareSend(msg);
    }

    onSubmitFile(file: File, responseFile: any) {
        let { path, mimetype, size } = responseFile;
        let msg = {
            file: file.name,
            mimetype: mimetype,
            size: size,
            src: `${config().api.host}/${path}`
        };

        this.prepareSend(msg);
    }

    onSubmitStickerChat(id: number) {
        let msg = {
            sticker: id
        };
        this.onToggleSticker();
        this.prepareSend(msg);
    }

    prepareSend(msg: IMessageDecorator) {
        let message = decorateMessage(msg);
        this.send(message);

        //@ show last submit message witn sending... status.
        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => ({
            ...previousState,
            typingText: "",
            messages: _messages
        }), () => {
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        });
    }

    send(message: IMessage) {
        this.props.dispatch(chatroom.sendMessage(message));
    }

    fileReaderChange = (e, results) => {
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
    }

    onToggleSticker() {
        this.chatHeight = (this.state.openButtomMenu) ? this.chatHeight + this.stickerBox : this.chatHeight - this.stickerBox;

        this.setState(previousState => ({
            ...previousState,
            openButtomMenu: !previousState.openButtomMenu
        }));
    }

    onLocation() {
        this.setState(previousState => ({
            ...previousState,
            openMapDialog: !previousState.openMapDialog
        }));
    }
    onLocationChange(position: Point) {
        this.tempLocation = position;
    }
    onSubmitPosition() {
        let message = { position: this.tempLocation };
        this.tempLocation = null;

        this.onLocation();
        this.prepareSend(message);
    }

    // {/*height="calc(100vh - 56px - 52px - 52px)"*/}
    render(): JSX.Element {
        let { chatroomReducer, stalkReducer } = this.props;

        return (
            <div id={"app_body"}>
                <Flexbox flexDirection="column">
                    <Flexbox flexDirection="column">
                        <Flexbox flexDirection="column"
                            justifyContent="flex-start" alignItems="center"
                            minWidth="400px"
                            style={{ height: this.chatHeight }}>
                            {
                                (this.state.earlyMessageReady) ?
                                    <p onClick={() => this.onLoadEarlierMessages()}>Load Earlier Messages!</p> : null
                            }
                            <ChatBox value={this.state.messages}
                                onSelected={(message: IMessage) => { }}
                                styles={{ overflowY: "auto" }} />
                            <MapDialog open={this.state.openMapDialog}
                                onClose={this.onLocation}
                                onSubmit={this.onSubmitPosition}
                                onLocationChange={this.onLocationChange} />
                        </Flexbox>
                        <Flexbox>
                            {
                                (this.state.openButtomMenu) ?
                                    <GridListSimple
                                        srcs={imagesPath}
                                        onSelected={this.onSubmitStickerChat} />
                                    : null
                            }
                        </Flexbox>
                    </Flexbox>
                    <Flexbox element="footer" justifyContent="center" alignContent="stretch" >
                        <TypingBox
                            disabled={this.props.chatroomReducer.chatDisabled}
                            onSubmit={this.onSubmitTextChat}
                            onValueChange={this.onTypingTextChange}
                            value={this.state.typingText}
                            fileReaderChange={this.fileReaderChange}
                            onSticker={this.onToggleSticker}
                            onLocation={this.onLocation} />
                        <UploadingDialog />
                        <SnackbarToolBox />
                    </Flexbox>
                </Flexbox >
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export const ChatPage = connect(mapStateToProps)(Chat) as React.ComponentClass<{ match, history, onError }>;
