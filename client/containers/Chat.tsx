import * as React from "react";
/**
 * Redux + Immutable
 */
import { connect } from "react-redux";
import * as async from 'async';

import { Flex, Box } from 'reflexbox';
import { TypingBox } from './TypingBox';

import { IComponentProps } from "../utils/IComponentProps";
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as chatRoomActions from "../redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

import { ContentType, IMessage } from "../chats/models/ChatDataModels";
import { MessageImp } from "../chats/models/MessageImp";

import ListMessages from "./ListMessages";

abstract class IComponentNameProps implements IComponentProps {
    location;
    params;
    router;
    dispatch;
    chatroomReducer;
    userReducer;
};

interface IComponentNameState {
    messages: any[],
    isLoadingEarlierMessages,
    typingText: string,
    earlyMessageReady
};

class Chat extends React.Component<IComponentNameProps, IComponentNameState> {
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

        let { chatroomReducer, userReducer, params} = this.props;

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
        let { chatroomReducer} = nextProps as IComponentNameProps;

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
                this.setState((previousState) => ({
                    ...previousState, earlyMessageReady: chatroomReducer.earlyMessageReady
                }));

                break;
            }
            case chatRoomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState(previousState => ({
                    ...previousState,
                    isLoadingEarlierMessages: false,
                    earlyMessageReady: false
                }));

                this.setInitMessages(chatRoomActions.getMessages());

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

        this.props.dispatch(chatRoomActions.loadEarlyMessageChunk());
    }

    roomInitialize(props: IComponentNameProps) {
        let { chatroomReducer, userReducer, params} = props;

        //@ todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatRoomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
        this.props.dispatch(chatRoomActions.joinRoom(chatroomReducer.room._id, StalkBridgeActions.getSessionToken(), userReducer.user.username));
    }

    onReceive(message: IMessage) {
        let messageImp = { ...message } as MessageImp;
        let _temp = this.state.messages.slice();
        StalkBridgeActions.getUserInfo(message.sender, (result) => {
            if (result) {
                messageImp.user = {
                    _id: result._id,
                    username: result.displayname,
                    avatar: result.image
                }
                _temp.push(message);
                this.setState((previousState) => ({
                    ...previousState, messages: _temp
                }));
            }
            else {
                _temp.push(message);
                this.setState((previousState) => ({
                    ...previousState, messages: _temp
                }));
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
            } else {
                messages.push(_messages[i]);
            }
        }

        this.setState({ ...this.state, messages: messages });
    }

    setMessageTemp(server_msg: IMessage) {
        console.log("server_response_msg", server_msg)
        if (!server_msg.uuid) return;

        let _messages = this.state.messages.slice();
        _messages.forEach((message: MessageImp) => {
            if (message.uuid == server_msg.uuid) {
                message.createTime = server_msg.createTime;
                message.uuid = server_msg.messageId;
                message.status = "Sent";
            }
        });

        this.setState({ ...this.state, messages: _messages });
    }

    setInitMessages(messages: Array<IMessage>) {
        this.setState((previousState) => { return { ...previousState, messages: messages } });
    }

    onTypingTextChange(event) {
        this.setState({ ...this.state, typingText: event.target.value });
    }

    onSubmitMessage() {
        if (this.state.typingText.length <= 0) return;

        let msg = {
            text: this.state.typingText
        };
        let message = this.prepareSendMessage(msg);
        this.sendText(message);

        let _messages = this.state.messages.slice();
        _messages.push(message);
        this.setState(previousState => ({ ...previousState, typingText: "", messages: _messages }));
    }

    prepareSendMessage(msg): IMessage {
        let message = new MessageImp();
        if (msg.image) {
            message.type = ContentType[ContentType.Image];
        }
        else if (msg.text) {
            message.body = msg.text;
            message.type = ContentType[ContentType.Text];
        } else if (msg.location) {
            message.type = ContentType[ContentType.Location];
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

    sendText(message: IMessage) {
        this.props.dispatch(chatRoomActions.sendMessage(message));
    }

    render(): JSX.Element {
        return (
            <div>
                <Flex flexColumn={true}> 
                    {
                        (this.state.earlyMessageReady) ?
                            <Box alignSelf='center' style={{}} >
                                <p onClick={() => this.onLoadEarlierMessages()}>Load Earlier Messages!</p>
                            </Box>
                            :
                            null
                    }
                    <Box flexAuto> </Box>
                    <div style={{height:500, overflowY:'scroll' }}>
                        <ListMessages value={this.state.messages} onSelected={(message: IMessage) => {

                        } } />
                    </div>
                </Flex>
                <Flex align='center' justify='center'>
                    <footer style={{ bottom: '0%', position: 'absolute' }} >
                        <TypingBox onSubmit={this.onSubmitMessage} onValueChange={this.onTypingTextChange} value={this.state.typingText} />
                    </footer>              
                </Flex>
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(Chat);
