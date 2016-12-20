import * as React from "react";
/**
 * Redux + Immutable
 */
import { connect } from "react-redux";
import * as async from 'async';

import { Box, Container } from 'react-layout-components';
import Messages from 'chat-template/dist/Messages';
import { TypingBox } from './TypingBox';

import { IComponentProps } from "../utils/IComponentProps";
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as chatRoomActions from "../redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

import { ContentType, IMessage } from "../chats/models/ChatDataModels";

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
    _id: string;
    message: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
    avatar: string;
    src: string;
    inbound: boolean;
    uuid: number;
    type: string;
    rid: string;
    target: string;
    sender: string;
    backColor = '#3d83fa';
    textColor = "white";
}


class Chat extends React.Component<IComponentNameProps, IComponentNameState> {
    _messages = [{
        message: 'How do I use this messaging app?',
        from: 'right',
        backColor: '#3d83fa',
        textColor: "white",
        avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
        duration: 2000,
        inbound: true
    }];

    componentWillMount() {
        console.log("Chat", this.props, this.state);

        this.onSubmitMessage = this.onSubmitMessage.bind(this);
        this.onTypingTextChange = this.onTypingTextChange.bind(this);
        this.roomInitialize = this.roomInitialize.bind(this);

        this.setState({ messages: this._messages, ...this.state });

        let { chatroomReducer, userReducer, params} = this.props;

        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS) {
            this.roomInitialize(this.props);
        }
        if (!chatroomReducer.room) {
            this.props.dispatch(chatRoomActions.getPersistendChatroom(params.filter));
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        let { chatroomReducer} = nextProps as IComponentNameProps;

        switch (chatroomReducer.state) {
            case chatRoomActions.ChatRoomActionsType.SELECT_CHAT_ROOM: {
                this.roomInitialize(nextProps);
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
                this.setState({ earlyMessageReady: chatroomReducer.earlyMessageReady });

                break;
            }
            case chatRoomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState({
                    isLoadingEarlierMessages: false,
                    earlyMessageReady: false
                });

                this.setInitMessages(chatRoomActions.getMessages());

                break;
            }
            default:
                break;
        }
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

    onReceive(message) {
        console.log("onReceive: ", message);

        StalkBridgeActions.getUserInfo(message.sender, (result) => {

            message._id = message._id;
            message.createdAt = message.createTime;

            if (message.type == ContentType[ContentType.Text])
                message.text = message.body;
            else if (message.type == ContentType[ContentType.Image])
                message.image = message.body;
            else if (message.type == ContentType[ContentType.Location])
                message.location = message.body

            message.user = {
                _id: result._id,
                name: result.displayname,
                avatar: result.image
            }
            this.setState((previousState) => {
                return {
                    messages: previousState.messages.append(message),
                    ...previousState
                };
            })
        })
    }

    setMessageStatus(uniqueId, status) {
        let messages = [];
        let found = false;

        for (let i = 0; i < this._messages.length; i++) {
            if (this._messages[i].uniqueId === uniqueId) {
                let clone = Object.assign({}, this._messages[i]);
                clone.status = status;
                messages.push(clone);
                found = true;
            } else {
                messages.push(this._messages[i]);
            }
        }

        if (found === true) {
            this.setMessages(messages);
        }
    }

    setMessageTemp(server_msg) {
        console.log("server_response_msg", server_msg)
        if (!server_msg.uuid) return

        let messages = [];
        let msg = new IGiftedChat();
        let found = false;

        this.state.messages.map((message, i) => {
            if (message.uniqueId == server_msg.uuid) {
                msg = message;
                msg.uniqueId = server_msg.messageId
                msg.createdAt = server_msg.createTime
                found = true
            } else {
                messages.push(message);
            }
        })

        if (found) {
            messages.unshift(msg);

            this.setState({
                ...this.state, messages: messages
            }, () => console.log(this.state));
        }
    }

    setInitMessages(messages: any[]) {
        let myProfile = this.props.userReducer.user;

        async.mapSeries(messages, (message, resultCB) => {
            //@ Is my message.
            if (message.sender == myProfile._id) {
                resultCB(null, this.setGiftMessage(message, myProfile));
            }
            else {
                StalkBridgeActions.getUserInfo(message.sender, (user) => {
                    resultCB(null, this.setGiftMessage(message, user));
                });
            }
        }, (err, results) => {
            this._messages = results.reverse();

            // append the message...
            this.setState({ messages: this._messages }, () => {
                console.log("Map completed: ", this.state.messages.length);
            });
        });
    }

    setGiftMessage(message, user) {
        let msg: IGiftedChat = {};

        if (message.type == ContentType[ContentType.Text]) {
            msg.text = message.body
        } else if (message.type == ContentType[ContentType.Image]) {
            msg.image = message.body
        } else if (message.type == ContentType[ContentType.Location]) {
            msg.location = message.body
        } else {
            msg.text = message.body
        }

        msg._id = message._id;
        msg.createdAt = message.createTime;
        msg.type = message.type;
        msg.user = {
            _id: user._id,
            name: user.displayname ? user.displayname : user.first_name + ' ' + user.last_name,
            avatar: user.image ? user.image : user.avatar
        }

        return msg
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

        let tempMsgs = this.state.messages.slice(1);
        tempMsgs.push(message);
        this.setState({ ...this.state, messages: tempMsgs, typingText: "" });
    }

    render(): JSX.Element {
        if (!this.state) return null;
        return (
            <Box column flex="1 0 auto">
                <Box flex="1 0 auto" alignItems="stretch">
                    {(this.state) ? <Messages messages={this.state.messages} styles={{ container: { position: '', bottom: '' } }} /> : null}
                </Box>
                <Container alignSelf='center' absolute style={{ bottom: '0%' }} >
                    <TypingBox onSubmit={this.onSubmitMessage} onValueChange={this.onTypingTextChange} value={this.state.typingText} />
                </Container>
            </Box>
        );
    }

    prepareSendMessage(msg): IMessage {
        let message = {} as IMessage;
        if (msg.image) {
            message.type = ContentType[ContentType.Image];
        }
        else if (msg.text) {
            message.body = msg.text;
            message.type = ContentType[ContentType.Text];
        } else if (msg.location) {
            message.type = ContentType[ContentType.Location];
        }

        message.uuid = Math.round(Math.random() * 10000); // simulating server-side unique id generation
        message.rid = this.props.chatroomReducer.room._id;
        message.sender = this.props.userReducer.user._id;
        message.target = "*";

        return message;
    }

    sendText(message: IMessage) {
        this.props.dispatch(chatRoomActions.sendMessage(message));
        this.setMessageStatus(message.uuid, 'Sending...');
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
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, {
        ...stateProps, ...dispatchProps
    })
}
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Chat);
