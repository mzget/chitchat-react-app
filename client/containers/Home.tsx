import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router';
import { Flex, Box } from 'reflexbox';

import { IComponentProps } from "../utils/IComponentProps";

import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as userActions from "../redux/user/userActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";
import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as chatlogsActions from "../redux/chatlogs/chatlogsActions";
import * as AuthRx from '../redux/authen/authRx';

import UtilsBox from "./UtilsBox";
import AuthenBox from './authen/AuthenBox';

abstract class IComponentNameProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
            agent_name: string;
        }
    };
    params;
    router;
    dispatch;
    authReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState {
};

class Home extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        console.log("Home", this.props);

        this.state = {
        }
        let { location: {query: {userId, username, roomId, contactId, agent_name}} } = this.props;

        if (username) {
            this.props.dispatch(userActions.fetchUser(username));
        }
        if (contactId) {
            this.props.dispatch(userActions.fetchContact(contactId));
        }
        if (agent_name) {
            this.props.dispatch(userActions.fetchAgent(agent_name));
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}},
            chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer
        } = nextProps as IComponentNameProps;

        switch (authReducer.state) {
            case AuthRx.AUTH_USER_SUCCESS: {
                this.props.router.push(`/chatlist/${authReducer.user}`);
            }
            default:
                break;
        }

        switch (chatroomReducer.state) {
            case chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS:
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
                else {
                    let members = chatroomActions.createChatRoom(userReducer);
                    this.props.dispatch(chatroomRxEpic.createPrivateChatRoom(members.owner, members.contact));
                }
                break;
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
            }
            default:
                break;
        }

        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                this.joinChatServer(nextProps);
                break;
            case userActions.FETCH_AGENT_SUCCESS:
                this.joinChatServer(nextProps);
                break;
            default:
                break;
        }

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_INIT_SUCCESS:
                if (this.props.stalkReducer.state != StalkBridgeActions.STALK_INIT_SUCCESS) {
                    if (contactId) {
                        this.fetch_privateChatRoom(contactId, userReducer.user._id);
                    }
                    else if (userReducer.contact) {
                        this.fetch_privateChatRoom(userReducer.contact._id, userReducer.user._id);
                    }
                }
                break;
            default:
                break;
        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    joinChatServer(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }

    public render(): JSX.Element {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = this.props;
        return (
            <div style={{ backgroundColor: '#EEEEEE', height: '100%' }}>
                <Flex align='center'>
                    <Box p={2} flexAuto></Box>
                    <AuthenBox {...this.props} />
                    <Box p={2} flexAuto></Box>
                </Flex>
                <UtilsBox />
                <Flex px={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <p>Stalk realtime messaging service.</p>
                    <Box p={2} flexAuto></Box>
                </Flex>
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

export default connect(mapStateToProps)(Home);
