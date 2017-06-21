"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var groupRx = require("../../redux/group/groupRx");
var privateGroupRxActions = require("../../redux/group/privateGroupRxActions");
var chatroomActions_1 = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var chatroomRxEpic_1 = require("../../chitchat/chats/redux/chatroom/chatroomRxEpic");
var mapStateToProps = function (state) { return (__assign({}, state)); };
exports.MainPageEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
    componentWillReceiveProps: function (nextProps) {
        var userReducer = nextProps.userReducer, chatroomReducer = nextProps.chatroomReducer, teamReducer = nextProps.teamReducer;
        if (!userReducer.user) {
            this.props.history.push("/");
        }
        switch (chatroomReducer.state) {
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                console.warn("GET_PERSISTEND_CHATROOM_FAILURE");
                break;
            }
            default:
                break;
        }
        if (chatroomReducer.state == chatroomActions_1.GET_PERSISTEND_CHATROOM_SUCCESS ||
            chatroomReducer.state == chatroomRxEpic_1.FETCH_PRIVATE_CHATROOM_SUCCESS ||
            chatroomReducer.state == chatroomRxEpic_1.CREATE_PRIVATE_CHATROOM_SUCCESS) {
            if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.history.push("/chatroom/chat/" + chatroomReducer.room._id);
            }
        }
    }
}), recompose_1.withHandlers({
    fetch_orgGroups: function (props) { return function () {
        if (!props.teamReducer.team)
            return props.history.replace("/");
        props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
    }; },
    fetch_privateGroups: function (props) { return function () {
        if (!props.teamReducer.team)
            return props.history.replace("/");
        props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
    }; }
}));
