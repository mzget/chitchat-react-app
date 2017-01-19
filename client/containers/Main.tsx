import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../utils/IComponentProps";

import * as userActions from "../redux/user/userActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";
import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as teamRx from "../redux/team/teamRx";

import ChatLogsBox from "./ChatLogsBox";
import ChatListBox from './ChatListBox';
import TeamListBox from './teams/TeamListBox';
import SimpleToolbar from '../components/Toolbar';

import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';

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

interface IComponentNameState { };

/**
 * Containers of chatlist, chatlogs, etc...
 */
class Main extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        console.log("Main", this.props);

        let { location: {query: {userId, username, roomId, contactId, agent_name}}, params } = this.props;

        if (params.filter) {
            this.props.dispatch(userActions.fetchUser(params.filter));
        }
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let { location: {query: {userId, username, roomId, contactId}},
            chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer
        } = nextProps as IComponentNameProps;

        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                if (userReducer.state != this.props.userReducer.state) {
                    this.joinChatServer(nextProps);
                    this.props.dispatch(teamRx.fetchUserTeams(userReducer.user._id));
                }
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
    }

    joinChatServer(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}}, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    public render(): JSX.Element {
        return (
            <div>
                <SimpleToolbar title={'ChatList'} />
                <TeamListBox />
                <ChatLogsBox {...this.props} />
            </div>);
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
export default connect(mapStateToProps)(Main);
