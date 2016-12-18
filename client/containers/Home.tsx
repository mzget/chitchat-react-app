import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router'

import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as userActions from "../redux/user/userActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

interface IComponentNameProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    dispatch, userReducer, chatroomReducer, router
};

interface IComponentNameState { };

class Home extends React.Component<IComponentNameProps, any> {
    componentDidMount() {
        console.log("Home", this.props);

        let { location: {query: {userId, username, roomId, contactId}} } = this.props;

        if (username) {
            this.props.dispatch(userActions.fetchUser(username));
        }
        if (contactId) {
            this.props.dispatch(userActions.fetchContact(contactId));
        }

        if (this.props.location.query.roomId) {

        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    joinChatServer() {
        let { location: {query: {userId, username, roomId, contactId}}, userReducer } = this.props;
        if (userReducer.user) {
            StalkBridgeActions.onStalkLoginSuccess.push(() => {
                this.fetch_privateChatRoom(contactId, userReducer.user._id);
            });
            StalkBridgeActions.stalkLogin(userReducer.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = nextProps;

        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS) {
            this.props.router.push(`/chat/${chatroomReducer.room._id}`);
        }

        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                this.joinChatServer();
                break;

            default:
                break;
        }
    }

    public render(): JSX.Element {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = this.props;
        return (
            <div>
                <span>Welcome to stalk chat service.</span>
                <li key={userId}><Link to={`/chat/${userId}`}>{username}</Link></li>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
