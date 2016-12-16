import * as React from 'react';

import { queue } from "async";
import ImageResizer from 'react-native-image-resizer';
const async = require("async");
import CONFIG from '../configs/config';
import { ContentType } from "../libs/chitchat/dataModel/contentType";
import ChatRoomComponent from "../chats/chatRoomComponent";

import * as UploadServiceHelper from "../servicesAccess/uploadServiceHelper";

/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthenActionsType } from '../reducers/auth/authActions';
import * as chatRoomActions from "../reducers/chatroom/chatroomActions";
import * as profileActions from '../reducers/profile/profileActions';
import * as StalkBridgeActions from '../reducers/stalkBridge/stalkBridgeActions';
import * as linkActions from '../reducers/links/linkActions';
import * as messageActions from "../reducers/message/messageActions";



interface IGiftedChat {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
    image: string;
    // additional custom parameters
}

interface IProps {
    _isMounted: boolean;
    _messages: any[];
}

class ChatRoom extends React.Component<IProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            messages: this.props._messages,
            isLoadingEarlierMessages: false,
            typingText: null,
            earlyMessageReady: false,
        };
        this.onReceive = this.onReceive.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.setInitMessages = this.setInitMessages.bind(this);

        this.onLoadEarlierMessages = this.onLoadEarlierMessages.bind(this);

        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
        this.props._isMounted = true;

        let { chatRoomReducer } = this.props;

        console.log("Chat: DidMount", JSON.stringify(chatRoomReducer.selectRoom), chatRoomReducer);

        if (chatRoomReducer.state == chatRoomActions.ChatRoomActionsType.SELECT_CHAT_ROOM) {
            //@ todo
            // - Init chatroom service.
            // - getPersistedMessage.
            // - Request join room.
            this.props.dispatch(chatRoomActions.initChatRoom(chatRoomReducer.selectRoom));
            this.props.dispatch(chatRoomActions.getPersistendMessage(chatRoomReducer.selectRoom._id));
            this.props.dispatch(chatRoomActions.joinRoom(chatRoomReducer.selectRoom._id, authReducer.token, profileReducer.form.profile.email));
        }
    }

    componentWillUnmount() {
        this.props._isMounted = false;
        console.log("Chat: WillUnmount");

        this.props.dispatch(chatRoomActions.leaveRoom());
    }

    componentWillReceiveProps(nextProps) {
        let { chatRoomReducer, authReducer, profileReducer} = nextProps;

        switch (chatRoomReducer.state) {
            /*
            case chatRoomActions.ChatRoomActionsType.SELECT_CHAT_ROOM: {
                //@ todo
                // - Init chatroom service.
                // - getPersistedMessage.
                // - Request join room.
                this.props.dispatch(chatRoomActions.initChatRoom(chatRoomReducer.selectRoom));
                this.props.dispatch(chatRoomActions.getPersistendMessage(chatRoomReducer.selectRoom._id));
                this.props.dispatch(chatRoomActions.joinRoom(chatRoomReducer.selectRoom._id, authReducer.token, profileReducer.profile.email));
                break;
            }*/
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_FAILURE: {
                this.setMessageStatus(chatRoomReducer.responseMessage.uuid, 'ErrorButton');
                this.props.dispatch(chatRoomActions.stop());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.SEND_MESSAGE_SUCCESS: {
                //this.setMessageStatus(chatRoomReducer.responseMessage.uuid, '');
                this.setMessageTemp(chatRoomReducer.responseMessage);
                this.props.dispatch(chatRoomActions.stop());
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_NEW_MESSAGE: {
                this.onReceive(chatRoomReducer.newMessage);

                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_PERSISTEND_MESSAGE_SUCCESS: {
                this.setInitMessages(ChatRoomComponent.getInstance().chatMessages);

                this.props.dispatch(chatRoomActions.checkOlderMessages());
                this.props.dispatch(chatRoomActions.getNewerMessageFromNet());

                break;
            }
            case chatRoomActions.ChatRoomActionsType.GET_NEWER_MESSAGE_SUCCESS: {
                this.setInitMessages(ChatRoomComponent.getInstance().chatMessages);
                break;
            }
            case chatRoomActions.ChatRoomActionsType.ON_EARLY_MESSAGE_READY: {
                this.setState({ earlyMessageReady: chatRoomReducer.earlyMessageReady });

                break;
            }
            case chatRoomActions.ChatRoomActionsType.LOAD_EARLY_MESSAGE_SUCCESS: {
                this.setState({
                    isLoadingEarlierMessages: false,
                    earlyMessageReady: false
                });

                this.setInitMessages(ChatRoomComponent.getInstance().chatMessages);

                break;
            }
            default:
                break;
        }
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

    setInitMessages(messages: IGiftedChat[]) {
        let myProfile = this.props.profileReducer.form.profile

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
        if (!server_msg.uuid) return

        let messages = [];
        let msg = null
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

        if (found == true) {
            messages.unshift(msg)
            this.setMessages(messages)
        }
    }

    setMessages(messages) {
        this._messages = messages;

        // append the message
        this.setState({
            messages: messages,
        });
    }

    setMsgKey(msg) {
        let message
        if (msg.image) {
            message = msg
            message.type = ContentType[ContentType.Image];
        }
        else if (msg[0].text) {
            message = msg[0]
            message.type = ContentType[ContentType.Text];
        } else if (msg[0].location) {
            message = msg[0]
            message.type = ContentType[ContentType.Location];
        }

        message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
        message.rid = this.props.chatRoomReducer.selectRoom._id;
        message.sender = this.props.profileReducer.form.profile._id;
        message.target = "*";

        return message
    }

    handleSend(_messages = []) {
        let messages = JSON.parse(JSON.stringify(_messages));
        if (messages[0].path) {
            this.resizeImage(messages)
            //this.uploadImage(messages);
            return
        } else {
            let message = this.setMsgKey(messages)
            this.sendText(message);
        }
    }

    sendText(message) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, message)
            };
        });
        this.props.dispatch(chatRoomActions.sendMessage(message));
        this.setMessageStatus(message.uniqueId, 'Sending...');
    }

    sendImage(messageUrl, uniqueId) {
        let messages = []
        let found = false;
        let image = null
        this.state.messages.map((message, i) => {
            if (message.uniqueId == uniqueId) {
                let temp = message;
                temp.image = messageUrl
                this.props.dispatch(chatRoomActions.sendFile(temp));
                this.setMessageStatus(image.uniqueId, 'Sending...');
            }
        })
    }

    resizeImage(messages) {
        let file = []
        let self = this
        let q = queue(function (task, callback) {
            console.log("queue worker");
            if (task.width && task.height && task.width < 800 && task.height < 600) {
                let temp = task
                temp.image = task.path
                file.push(temp)
                callback();
            } else {
                ImageResizer.createResizedImage(task.path, 800, 600, 'JPEG', 80).then((resizedImageUri) => {
                    let temp = task
                    temp.image = resizedImageUri
                    file.push(temp)
                    callback();
                }).catch((err) => {
                    callback(err);
                });
            }
        }, 1);

        // assign a callback
        q.drain = function () {
            self.uploadImage(file)
            console.log('FINNISH')
        };

        q.push(messages, function (err) {
            if (!err)
                console.log('finished processing item');
            else
                console.log(err)
        });
    }

    uploadImage(messages) {
        let arrayImage = [];
        let uploadPath = CONFIG.BOL_REST.chat + "/upload"

        messages.map((message) => {
            let image = this.setMsgKey(message)
            if (image.image) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, image)
                    };
                });
                arrayImage.unshift({
                    image: image.image,
                    extension: 'JPG',
                    uniqueId: image.uniqueId
                })
            }
        })

        if (arrayImage.length <= 0) return

        let self = this

        UploadServiceHelper.manageUploadQueue(arrayImage, uploadPath, function (result) {
            console.log('chat images upload finnish', result)
        }, true, function (result) {
            self.sendImage(result.url, result.id)
        });
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
                    messages: GiftedChat.append(previousState.messages, message)
                };
            })
        })
    }

    onLoadEarlierMessages() {
        this.setState((previousState) => {
            return {
                isLoadingEarlierMessages: true,
            };
        });
        this.props.dispatch(chatRoomActions.loadEarlyMessageChunk());
    }

    onErrorButtonPress(message = {}) {
        // Your logic here
        // re-send the failed message

        // remove the status
        this.setMessageStatus(message.uniqueId, '');
    }

    renderCustomActions(props) {
        if (Platform.OS === 'ios') {
            return (
                <CustomActions
                    {...props}
                    />
            );
        }
        const options = {
            'Action 1': (props) => {
                alert('option 1');
            },
            'Action 2': (props) => {
                alert('option 2');
            },
            'Cancel': () => { },
        };
        return (
            <Actions
                {...props}
                options={options}
                />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#f0f0f0',
                    },
                    right: {
                        backgroundColor: 'red',
                    }
                }}
                />
        );
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
                />
        );
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    renderMessageImage(props) {
        return <MessageImage
            {...props}
            />
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}

                onSend={this.handleSend}
                loadEarlier={this.state.earlyMessageReady}
                isLoadingEarlier={this.state.isLoadingEarlierMessages}
                isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
                onLoadEarlier={this.onLoadEarlierMessages}
                onErrorButtonPress={this.onErrorButtonPress.bind(this)}

                user={{
                    _id: this.props.profileReducer.form.profile._id, // sent messages should have same user._id
                }}
                renderMessageImage={this.renderMessageImage}
                renderActions={this.renderCustomActions}
                renderBubble={this.renderBubble}
                renderCustomView={this.renderCustomView}
                renderFooter={this.renderFooter}
                />
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
function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge()
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);