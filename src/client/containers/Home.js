var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { connect } from "react-redux";
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as userActions from "../redux/user/userActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";
;
;
class Home extends React.Component {
    constructor() {
        super(...arguments);
        this.fetch_privateChatRoom = (roommateId, owerId) => {
            this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
        };
    }
    componentDidMount() {
        console.log("Home", this.props);
        let { location: { query: { userId, username, roomId, contactId } } } = this.props;
        if (username) {
            this.props.dispatch(userActions.fetchUser(username));
        }
        if (contactId) {
            this.props.dispatch(userActions.fetchContact(contactId));
        }
        if (contactId && userId) {
            this.fetch_privateChatRoom(contactId, userId);
        }
        if (this.props.location.query.roomId) {
        }
    }
    joinChatServer() {
        if (this.props.userReducer.user) {
            StalkBridgeActions.stalkLogin(this.props.userReducer.user);
        }
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, userReducer } = nextProps;
        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS) {
        }
        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                this.joinChatServer();
                break;
            default:
                break;
        }
    }
    render() {
        return (React.createElement("span", null, "Welcome to stalk chat service."));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
