"use strict";
exports.__esModule = true;
var recompose_1 = require("recompose");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
exports.GroupListEnhancer = recompose_1.compose(recompose_1.lifecycle({
    componentWillMount: function () {
        this.props.fetchGroup();
    }
}), recompose_1.withHandlers({
    onselectGroup: function (props) { return function (data) {
        props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(function () {
            props.dispatch(chatroomActions.getPersistendChatroom(data._id));
        });
    }; }
}));
