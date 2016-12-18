import * as React from "react";
/**
 * Redux + Immutable
 */
import { connect } from "react-redux";

import Conversation from 'chat-template/dist/Conversation';

import * as chatRoomActions from "../redux/chatroom/chatroomActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

interface IComponentNameProps {
    dispatch,
    chatroomReducer
};

interface IComponentNameState { };

class Chat extends React.Component<IComponentNameProps, any> {
    componentDidMount() {

        let { chatroomReducer } = this.props;

        console.log("Chat", this.props);

        //@ todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        chatRoomActions.initChatRoom(chatroomReducer.room);
        this.props.dispatch(chatroomRxEpic.getPersistendMessage(chatroomReducer.room._id));
        //  this.props.dispatch(chatRoomActions.joinRoom(chatRoomReducer.selectRoom._id, authReducer.token, profileReducer.form.profile.email));
    }

    render(): JSX.Element {
        var messages = [{
            message: 'How do I use this messaging app?',
            from: 'right',
            backColor: '#3d83fa',
            textColor: "white",
            avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
            duration: 2000,
            inbound: false
        }];

        return (
            <div >
                <Conversation height={300} messages={messages} />
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
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
