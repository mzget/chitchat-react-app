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

import ChatLogs from "./ChatLogs";
import { DialogBox } from "../components/DialogBox";
import { AlertBox } from "../components/AlertBox";
import { SnackbarSimple } from "../components/SnackbarSimple";
import CircularProgressSimple from "../components/CircularProgressSimple";

import * as AlertMsg from "../consts/AlertMsg";

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
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState {
    openDialog: boolean,
    dialogTitle: string,
    dialogMessage: string,

    openSnackbar: boolean,
    snackbarMessage: string,
    snackbarClose: (reason: string) => void
};

class Home extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        console.log("Home", this.props);

        this.state = {
            openDialog: false,
            dialogTitle: "",
            dialogMessage: "",

            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
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
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, chatlogReducer, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        switch (chatroomReducer.state) {
            case chatroomRxEpic.FETCH_PRIVATE_CHATROOM_SUCCESS:
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
                else {
                    this.createChatRoom();
                }
                break;
            case chatroomRxEpic.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (chatroomReducer.room.length > 0) {
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
            case StalkBridgeActions.STALK_INIT_FAILURE:
                this.setState({
                    ...this.state,
                    openDialog: true,
                    dialogTitle: AlertMsg.stalkInitFail.title,
                    dialogMessage: AlertMsg.stalkInitFail.message
                });
                break;
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

    public render(): JSX.Element {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = this.props;
        return (
            <div>
                <Flex>
                    <Box sm={6} md={3}>Box</Box>
                    <Box sm={6} md={3}>Box</Box>
                    <Box sm={6} md={3}>Box</Box>
                    <Box sm={6} md={3}>Box</Box>
                </Flex>
                <Flex px={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <h2>Welcome to stalk chat service.</h2>
                    <Box p={2} flexAuto></Box>
                    <Box p={2} flexAuto></Box>
                    <li key={userId}><Link to={`/chat/${userId}`}>{username}</Link></li>
                    <Box p={2} flexAuto></Box>
                </Flex>
                <ChatLogs {...this.props} />

                <DialogBox handleClose={() => { this.setState({ ...this.state, openDialog: false }) } }
                    open={this.state.openDialog}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}
                    />

                <Flex p={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <CircularProgressSimple />
                    <Box p={2} flexAuto></Box>
                </Flex>
                <SnackbarSimple open={this.state.openSnackbar} message={this.state.snackbarMessage} handleRequestClose={(reason) => {
                    console.log(reason);
                } } hideDuration={2000} />
            </div>
        );
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    createChatRoom = () => {
        let { userReducer } = this.props;
        if (userReducer.user && userReducer.contact) {
            type Member = { _id: string, user_role: string };
            let owner = {} as Member;
            owner._id = userReducer.user._id;
            owner.user_role = "agent";

            let contact = {} as Member;
            contact._id = userReducer.contact._id;
            contact.user_role = "user";
            this.props.dispatch(chatroomRxEpic.createPrivateChatRoom(owner, contact));
        }
        else {
            console.warn("Not yet ready for create chatroom");
        }
    }

    joinChatServer(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
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
