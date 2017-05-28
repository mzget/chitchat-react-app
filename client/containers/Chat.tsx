import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import * as async from "async";
import { Flex, Box } from "reflexbox";
import * as Colors from "material-ui/styles/colors";

import { ChitChatFactory } from "../chitchat/chats/chitchatFactory";
const config = () => ChitChatFactory.getInstance().config;

import { TypingBox } from "./TypingBox";
import { ChatBox } from "./chat/ChatBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import UploadingDialog from "./UploadingDialog";
import GridListSimple from "../components/GridListSimple";

import { IComponentProps } from "../utils/IComponentProps";
import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../chitchat/chats/redux/chatroom/chatroomRxEpic";

import { MessageType, IMessage } from "../chitchat/shared/Message";
import { MessageImp } from "../chitchat/chats/models/MessageImp";

import { imagesPath } from "../chitchat/consts/StickerPath";
import * as FileType from "../chitchat/shared/FileType";

import { decorateMessage } from "../actions/chatroom/chatroomMessageUtils";

interface IComponentNameState {
    messages: any[];
    isLoadingEarlierMessages;
    typingText: string;
    earlyMessageReady;
    openButtomMenu: boolean;
    onAlert: boolean;
}

class Chat extends React.Component<IComponentProps, IComponentNameState> {
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    h_header = null;
    h_subHeader = 34;
    h_body = null;
    h_typingArea = null;
    bottom = this.clientHeight * 0.1;
    h_stickerBox = this.clientHeight * 0.3;

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
        this.fileReaderChange = this.fileReaderChange.bind(this);

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

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, stalkReducer } = nextProps;

        let warning_bar = document.getElementById("warning_bar");
        let typing_box = document.getElementById("typing_box");
        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));

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
                    this.setState(previousState => ({
                        ...previousState,
                        messages: messages
                    }), () => {
                        let chatBox = document.getElementById("app_body");
                        chatBox.scrollTop = chatBox.scrollHeight;
                    });
                });

                this.props.dispatch(chatroomActions.emptyState());
                break;
            }
            case chatroomRxEpic.GET_PERSISTEND_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => ({
                        ...previousState,
                        messages: messages
                    }));
                });

                this.props.dispatch(chatroomActions.checkOlderMessages());
                this.props.dispatch(chatroomActions.getNewerMessageFromNet());

                break;
            }
            case chatroomActions.GET_NEWER_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => ({
                        ...previousState,
                        messages: messages
                    }));
                });
                break;
            }
            case chatroomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState((previousState) => ({
                    ...previousState,
                    earlyMessageReady: chatroomReducer.earlyMessageReady
                }));

                break;
            }
            case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
                chatroomActions.getMessages().then(messages => {
                    this.setState(previousState => ({
                        ...previousState,
                        isLoadingEarlierMessages: false,
                        earlyMessageReady: false,
                        messages: messages
                    }));
                });

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

        this.props.dispatch(chatroomActions.loadEarlyMessageChunk());
    }

    roomInitialize(props: IComponentProps) {
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
            } else {
                messages.push(_messages[i]);
            }
        }

        this.setState({ ...this.state, messages: messages });
    }

    setMessageTemp(server_msg: MessageImp) {
        let _messages = this.state.messages.slice();
        _messages.forEach((message: MessageImp) => {
            if (message.uuid == server_msg.uuid) {
                message.body = server_msg.body;
                message.createTime = server_msg.createTime;
                message.uuid = parseInt(server_msg._id);
                message.status = "Sent";
            }
        });

        this.setState({ ...this.state, messages: _messages });
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

    prepareSend(msg) {
        let message = decorateMessage(msg);
        this.send(message);

        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => ({
            ...previousState,
            typingText: "",
            messages: _messages
        }), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    send(message: IMessage) {
        this.props.dispatch(chatroomActions.sendMessage(message));
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
        this.h_body = (this.state.openButtomMenu) ? this.h_body + this.h_stickerBox : this.h_body - this.h_stickerBox;
        this.setState(previousState => ({
            ...previousState,
            openButtomMenu: !previousState.openButtomMenu
        }), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    render(): JSX.Element {
        let { chatroomReducer, stalkReducer } = this.props;

        return (


            <div style={{ height: "calc(100vh - 148px)" }}>
                <div style={{ overflowY: "scroll", height: "100%" }} id={"app_body"}>
                    {
                        (this.state.earlyMessageReady) ?
                            <Flex align="center" justify="center">
                                <p onClick={() => this.onLoadEarlierMessages()}>Load Earlier Messages!</p>
                            </Flex>
                            :
                            null
                    }
                    <ChatBox
                        styles={{ overflowX: "hidden" }}
                        value={this.state.messages}
                        onSelected={(message: IMessage) => { }} />
                    {
                        (this.state.openButtomMenu) ?
                            <GridListSimple
                                boxHeight={this.h_stickerBox}
                                srcs={imagesPath}
                                onSelected={this.onSubmitStickerChat} />
                            : null
                    }

                </div>
                <div>
                    <TypingBox
                        disabled={this.props.chatroomReducer.chatDisabled}
                        onSubmit={this.onSubmitTextChat}
                        onValueChange={this.onTypingTextChange}
                        value={this.state.typingText}
                        fileReaderChange={this.fileReaderChange}
                        onSticker={this.onToggleSticker} />
                    <UploadingDialog />
                    <SnackbarToolBox />
                </div>
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export const ChatPage = connect(mapStateToProps)(Chat) as React.ComponentClass<{ match, history, onError }>;
