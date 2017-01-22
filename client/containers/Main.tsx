﻿import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from 'reflexbox';
import * as Colors from 'material-ui/styles/colors';

import { IComponentProps } from '../utils/IComponentProps';

import SimpleToolbar from '../components/SimpleToolbar';
import ChatLogsBox from "./ChatLogsBox";
import ChatListBox from "./chatlist/ChatListBox";
import UtilsBox from "./UtilsBox";

import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as chatlogsActions from "../redux/chatlogs/chatlogsActions";
import * as chatroomRxEpic from "../redux/chatroom/chatroomRxEpic";
import * as userRx from "../redux/user/userRx";
import * as authRx from "../redux/authen/authRx";
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';

interface IComponentNameState {
    toolbar: string;
};

class Main extends React.Component<IComponentProps, IComponentNameState> {

    menus = ["admin", "log out"];
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = null;
    bodyHeight = null;
    footerHeight = null;

    componentWillMount() {
        this.state = {
            toolbar: "Home"
        };

        this.headerHeight = this.clientHeight * 0.1;
        this.bodyHeight = (this.clientHeight * 0.9) - 50;
        this.footerHeight = 50;

        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let {location: {query: {userId, username, roomId, contactId}}, userReducer, stalkReducer, chatroomReducer, teamReducer} = nextProps;

        switch (userReducer.state) {
            case userRx.FETCH_USER_SUCCESS: {
                if (userReducer.user) {
                    this.joinChatServer(nextProps);
                }
                break;
            }
            case userRx.FETCH_AGENT_SUCCESS:
                this.joinChatServer(nextProps);
                break;
            default:
                if (!userReducer.user) {
                    this.props.router.push('/');
                }
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
            case chatlogsActions.STALK_INIT_CHATSLOG: {
                this.props.dispatch(StalkBridgeActions.getLastAccessRoom());
                break;
            }
            default:
                break;
        }
    }

    joinChatServer(nextProps: IComponentProps) {
        let {stalkReducer, userReducer } = nextProps;

        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
    };

    onSelectMenuItem(id, value) {
        console.log(this.menus[id]);

        let {authReducer} = this.props;
        switch (id) {
            case 0:
                this.props.router.push(`/admin/${authReducer.user}`);
                break;
            case 1:
                this.props.dispatch(authRx.logout(this.props.authReducer.token));
                break;
            default:
                break;
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <div style={{ height: this.headerHeight }}>
                    <SimpleToolbar title={this.state.toolbar} menus={this.menus} onSelectedMenuItem={this.onSelectMenuItem} />
                </div>
                <div style={{ height: this.bodyHeight }}>
                    <ChatListBox {...this.props} />
                    <ChatLogsBox {...this.props} />
                    <UtilsBox />
                </div>
                <Flex style={{ height: this.footerHeight, backgroundColor: Colors.red500 }} align='center' justify='center' flexColumn={true}>
                    <Flex flexColumn={true}>
                        <span style={{ color: Colors.white }}>Unable to connect whit chat service.</span>
                        <span style={{ color: Colors.white }}>Check your Internet connection.</span>
                    </Flex>
                </Flex>
            </div>);
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
