"use strict";
const recompose_1 = require("recompose");
const chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
exports.GroupListEnhancer = recompose_1.compose(recompose_1.lifecycle({
    componentWillMount() {
        this.props.fetchGroup();
    }
}), recompose_1.withHandlers({
    onselectGroup: (props) => data => {
        props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() => {
            props.dispatch(chatroomActions.getPersistendChatroom(data._id));
        });
    }
}));
