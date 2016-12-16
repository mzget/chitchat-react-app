var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Conversation from 'chat-template/dist/Conversation';
import * as chatRoomActions from "../redux/chatroom/chatroomActions";
;
;
class Chat extends React.Component {
    componentDidMount() {
        let { chatRoomReducer } = this.props;
        if (chatRoomReducer.state == chatRoomActions.ChatRoomActionsType.SELECT_CHAT_ROOM) {
            //@ todo
            // - Init chatroom service.
            // - getPersistedMessage.
            // - Request join room.
            this.props.dispatch(chatRoomActions.initChatRoom(chatRoomReducer.selectRoom));
            this.props.dispatch(chatRoomActions.getPersistendMessage(chatRoomReducer.selectRoom._id));
        }
    }
    render() {
        var messages = [{
                message: 'How do I use this messaging app?',
                from: 'right',
                backColor: '#3d83fa',
                textColor: "white",
                avatar: 'https://www.seeklogo.net/wp-content/uploads/2015/09/google-plus-new-icon-logo.png',
                duration: 2000,
                inbound: false
            }];
        return (React.createElement("div", null,
            React.createElement(Conversation, { height: 300, messages: messages })));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
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
