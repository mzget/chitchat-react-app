var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { connect } from "react-redux";
import { shallowEqual, compose, withHandlers, lifecycle } from "recompose";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../../redux/group/groupRx";
import * as privateGroupRxActions from "../../redux/group/privateGroupRxActions";
import { GET_PERSISTEND_CHATROOM_SUCCESS } from "../../chitchat/chats/redux/chatroom/chatroomActions";
import { FETCH_PRIVATE_CHATROOM_SUCCESS, CREATE_PRIVATE_CHATROOM_SUCCESS } from "../../chitchat/chats/redux/chatroom/chatroomRxEpic";
const mapStateToProps = (state) => (__assign({}, state));
export const MainPageEnhancer = compose(connect(mapStateToProps), lifecycle({
    componentWillReceiveProps(nextProps) {
        let { userReducer, chatroomReducer, teamReducer } = nextProps;
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
            chatroomReducer.state == CREATE_PRIVATE_CHATROOM_SUCCESS) {
            if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.history.push(`/chatroom/chat/${chatroomReducer.room._id}`);
            }
        }
    }
}), withHandlers({
    fetch_orgGroups: (props) => () => {
        if (!props.teamReducer.team)
            return props.history.replace(`/`);
        props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
    },
    fetch_privateGroups: (props) => () => {
        props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
    }
}));
