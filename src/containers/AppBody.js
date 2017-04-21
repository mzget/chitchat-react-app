"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
const chatroomActions_1 = require("../chitchat/chats/redux/chatroom/chatroomActions");
const chatroomRxEpic_1 = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
class AppBody extends React.Component {
    componentWillReceiveProps(nextProps) {
        let { route, chatroomReducer } = nextProps;
        if (chatroomReducer.state == chatroomActions_1.GET_PERSISTEND_CHATROOM_SUCCESS || chatroomReducer.state == chatroomRxEpic_1.FETCH_PRIVATE_CHATROOM_SUCCESS) {
            if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.router.push(`/chatslist/chat/${chatroomReducer.room._id}`);
            }
        }
    }
    render() {
        let { chatroomReducer, params, userReducer, onError } = this.props;
        return (React.createElement("div", null, (params.filter == "profile") ?
            React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError }) :
            (params.filter == "chat") ? React.createElement(Chat_1.ChatPage, null) : React.createElement(Post_1.Post, null)));
    }
}
exports.AppBody = AppBody;
