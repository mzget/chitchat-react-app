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
import TeamCreateBox from './teams/TeamCreateBox';
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
    teamReducer;
};

interface IComponentNameState {
    toolbar: string;
};

/**
 * Containers of chatlist, chatlogs, etc...
 */
class Team extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        console.log("Main", this.props);

        let { location: {query: {userId, username, roomId, contactId, agent_name}}, params } = this.props;

        this.state = {
            toolbar: 'Home'
        }

        if (params.filter) {
            this.props.dispatch(userActions.fetchUser(params.filter));
        }
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let { location: {query: {userId, username, roomId, contactId}},
            chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer, teamReducer
        } = nextProps as IComponentNameProps;

        switch (userReducer.state) {
            case userActions.FETCH_USER_SUCCESS:
                if (userReducer.state != this.props.userReducer.state) {
                    this.joinChatServer(nextProps);
                    this.props.dispatch(teamRx.getTeamsInfo(userReducer.user.teams));
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

        (!!teamReducer.teams && teamReducer.teams.length > 0) ?
            this.setState({ toolbar: 'Your Teams' }) : this.setState({ toolbar: 'Create Team' });
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
        let { location: {query: {userId, username, roomId, contactId}}, userReducer, stalkReducer, teamReducer } = this.props as IComponentNameProps;

        return (
            <div>
                <SimpleToolbar title={this.state.toolbar} />
                {(!!teamReducer.teams && teamReducer.teams.length > 0) ? <TeamListBox {...this.props} /> : <TeamCreateBox {...this.props} />}

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
export default connect(mapStateToProps)(Team);
