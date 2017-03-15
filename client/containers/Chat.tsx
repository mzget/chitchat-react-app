import * as React from "react";
import { connect } from "react-redux";
import * as async from "async";
import { Flex, Box } from "reflexbox";
import * as Colors from "material-ui/styles/colors";

import Config from "../configs/config";

import { TypingBox } from "./TypingBox";
import { ChatBox } from "./chat/ChatBox";
import { SimpleToolbar } from "../components/SimpleToolbar";
import UtilsBox from "./UtilsBox";
import UploadingDialog from "./UploadingDialog";
import GridListSimple from "../components/GridListSimple";
import { WarningBar } from "../components/WarningBar";

import { IComponentProps } from "../utils/IComponentProps";
import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

import { ContentType, IMessage } from "../chats/models/ChatDataModels";
import { MessageImp } from "../chats/models/MessageImp";

import { imagesPath } from "../consts/StickerPath";
import * as FileType from "../../server/scripts/FileType";

interface IComponentNameState {
    messages: any[];
    isLoadingEarlierMessages;
    typingText: string;
    earlyMessageReady;
    openButtomMenu: boolean;
};

class Chat extends React.Component<IComponentProps, IComponentNameState> {
    options = "Options";
    favorite = "Favorite";
    toolbarMenus = [this.options, this.favorite];
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
            openButtomMenu: false
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

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer, stalkReducer } = nextProps;

        let warning_bar = document.getElementById("warning_bar");
        let typing_box = document.getElementById("typing_box");
        this.h_header = document.getElementById("toolbar").clientHeight;
        this.h_typingArea = typing_box.clientHeight;
        this.h_subHeader = (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ? 34 : 0;
        this.h_body = (this.clientHeight - (this.h_header + this.h_subHeader + this.h_typingArea));

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_CONNECTION_PROBLEM:
                this.setState(previous => ({ ...previous, chatDisabled: true }));
                break;
            case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT:
                this.props.router.replace("/");
                break;
            default:
                this.setState(previous => ({ ...previous, chatDisabled: false }));
                break;
        }

        switch (chatroomReducer.state) {
            case chatroomActions.JOIN_ROOM_FAILURE: {
                this.setState(previous => ({ ...previous, chatDisabled: true }), () => {
                    this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
                });
                break;
            }
            case chatroomActions.JOIN_ROOM_SUCCESS: {
                this.setState(previous => ({ ...previous, chatDisabled: false }), () => {
                    this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
                });
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

                if (fileInfo.type.match(FileType.imageType)) {
                    this.onSubmitImageChat(fileInfo, responseFile.path);
                }
                else if (fileInfo.type.match(FileType.videoType)) {
                    this.onSubmitVideoChat(fileInfo, responseFile.path);
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
            case chatroomActions.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
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
            case chatroomActions.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
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
            case chatroomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
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
                message.uuid = server_msg._id;
                message.status = "Sent";
            }
        });

        this.setState({ ...this.state, messages: _messages }, () => console.log(this.state.messages));
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
            src: `${Config.api.host}/${responseUrl}`
        };

        this.prepareSend(msg);
    }

    onSubmitVideoChat(file: File, responseUrl: string) {
        let msg = {
            video: file.name,
            src: `${Config.api.host}/${responseUrl}`
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
        let message = this.decorateMessage(msg);
        this.send(message);

        let _messages = (!!this.state.messages) ? this.state.messages.slice() : new Array();
        _messages.push(message);
        this.setState(previousState => ({ ...previousState, typingText: "", messages: _messages }), () => {
            let chatBox = document.getElementById("app_body");
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    decorateMessage(msg): IMessage {
        let message = new MessageImp();

        if (msg.image != null) {
            message.body = msg.image;
            message.src = msg.src;
            message.type = ContentType[ContentType.Image];
        }
        else if (msg.text != null) {
            message.body = msg.text;
            message.type = ContentType[ContentType.Text];
        }
        else if (msg.location != null) {
            message.type = ContentType[ContentType.Location];
        }
        else if (msg.video != null) {
            message.body = msg.video;
            message.src = msg.src;
            message.type = ContentType[ContentType.Video];
        }
        else if (msg.sticker != null) {
            message.body = msg.sticker;
            message.src = imagesPath[msg.sticker].img;
            message.type = ContentType[ContentType.Sticker];
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
        message.status = "Sending...";

        return message;
    }

    send(message: IMessage) {
        this.props.dispatch(chatroomActions.sendMessage(message));
    }

    fileReaderChange = (e, results) => {
        results.forEach(result => {
            const [progressEvent, file] = result;

            console.dir(file);

            this.props.dispatch(chatroomRxEpic.uploadFile(progressEvent, file));
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

    render(): JSX.Element {
        let { chatroomReducer, stalkReducer } = this.props;

        return (
            <div style={{ overflowY: "hidden" }}>
                <div style={{ height: this.h_header }} id={"toolbar"}>
                    <SimpleToolbar
                        title={(chatroomReducer.room && chatroomReducer.room.name) ? chatroomReducer.room.name : "Empty"}
                        menus={this.toolbarMenus}
                        onSelectedMenuItem={this.onMenuSelect}
                        onBackPressed={this.onBackPressed} />
                </div>
                {
                    (stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
                        <WarningBar /> : null
                }
                <div style={{ height: this.h_body, overflowY: "auto", backgroundColor: Colors.indigo50 }} id={"app_body"}>
                    <Flex flexColumn={true}>
                        {
                            (this.state.earlyMessageReady) ?
                                <Flex align="center" justify="center">
                                    <p onClick={() => this.onLoadEarlierMessages()}>Load Earlier Messages!</p>
                                </Flex>
                                :
                                null
                        }
                        <ChatBox
                            styles={{ width: this.clientWidth, overflowX: "hidden" }}
                            value={this.state.messages}
                            onSelected={(message: IMessage) => { }} />
                    </Flex>
                </div>
                {
                    (this.state.openButtomMenu) ?
                        <GridListSimple
                            boxHeight={this.h_stickerBox}
                            srcs={imagesPath}
                            onSelected={this.onSubmitStickerChat} />
                        : null
                }
                <TypingBox
                    styles={{ width: this.clientWidth }}
                    disabled={this.props.chatroomReducer.chatDisabled}
                    onSubmit={this.onSubmitTextChat}
                    onValueChange={this.onTypingTextChange}
                    value={this.state.typingText}
                    fileReaderChange={this.fileReaderChange}
                    onSticker={this.onToggleSticker} />
                <UploadingDialog />
                <UtilsBox />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Chat);
