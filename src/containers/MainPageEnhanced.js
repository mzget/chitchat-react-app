"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const mapStateToProps = (state) => (__assign({}, state));
exports.MainPageEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { location, userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer } = nextProps;
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
        if (chatroomReducer.state == GET_PERSISTEND_CHATROOM_SUCCESS ||
            chatroomReducer.state == FETCH_PRIVATE_CHATROOM_SUCCESS ||
            chatlogReducer.state == CREATE_PRIVATE_CHATROOM_SUCCESS) {
            if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.history.push(`/chatroom/chat/${chatroomReducer.room._id}`);
            }
        }
    }
}), recompose_1.withHandlers({
    fetch_orgGroups: (props) => () => {
        props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
    },
    fetch_privateGroups: (props) => () => {
        props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
    }
}));
