import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

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
    dispatch,
    userReducer
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
        if (contactId && userId) {
            this.fetch_privateChatRoom(contactId, userId);
        }

        if (this.props.location.query.roomId) {

        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    joinChatServer() {
        if (this.props.userReducer.user) {
            StalkBridgeActions.stalkLogin(this.props.userReducer.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = nextProps;

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

    public render(): JSX.Element {
        return (<span>Welcome to stalk chat service.</span>);
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
