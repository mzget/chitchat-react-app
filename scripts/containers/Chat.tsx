import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import Conversation from 'chat-template/dist/Conversation';

import * as chatRoomActions from "../redux/chatroom/chatroomActions";

interface IComponentNameProps { };

interface IComponentNameState { };

class Chat extends React.Component<any, any> {
    componentDidMount() {

        let { chatRoomReducer } = this.props;

        //@ todo
        // - Init chatroom service.
        // - getPersistedMessage.
        // - Request join room.
        this.props.dispatch(chatRoomActions.initChatRoom(chatRoomReducer.selectRoom));
        this.props.dispatch(chatRoomActions.getPersistendMessage(chatRoomReducer.selectRoom._id));
        //       this.props.dispatch(chatRoomActions.joinRoom(chatRoomReducer.selectRoom._id, authReducer.token, profileReducer.form.profile.email));
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
    const creators = Map()
        .merge()
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
