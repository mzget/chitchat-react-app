import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router';

import { IComponentProps } from "../utils/IComponentProps";

import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as userActions from "../redux/user/userActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";

import ChatLogs from "./ChatLogs";
import { DialogBox } from "../components/DialogBox";

abstract class IComponentNameProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    params;
    router;
    dispatch;
    userReducer;
    chatroomReducer;
    stalkReducer;
};

interface IComponentNameState {
    openDialog: boolean
};

class Home extends React.Component<IComponentNameProps, IComponentNameState> {
    constructor(props) {
        super(props);

        this.state = {
            openDialog: false
        }
    }

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

    joinChatServer(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, userReducer } = nextProps as IComponentNameProps;
        if (userReducer.user) {
            StalkBridgeActions.onStalkLoginSuccess.push(() => {
                if (contactId) {
                    this.fetch_privateChatRoom(contactId, userReducer.user._id);
                }
            });
            StalkBridgeActions.stalkLogin(userReducer.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        if (chatroomReducer.state == chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS) {
            this.props.router.push(`/chat/${chatroomReducer.room._id}`);
        }

        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                this.joinChatServer(nextProps);
                break;

            default:
                break;
        }

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_INIT_FAILURE:
                this.setState({ openDialog: true });
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
                <ChatLogs {...this.props} />
                <DialogBox handleClose={() => { this.setState({ openDialog: false }) } } open={this.state.openDialog} />
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
