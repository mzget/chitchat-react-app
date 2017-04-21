﻿import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ProfileEnhancer } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/m_ChatLogsBox";
import { ContactBox } from "./chatlist/m_ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";

import { ConnectedAppBody } from "./AppBody";

import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatlogsActions from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as chatlogRxActions from "../chitchat/chats/redux/chatlogs/chatlogRxActions";
import * as chatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import * as userRx from "../redux/user/userRx";
import * as authRx from "../redux/authen/authRx";
import * as groupRx from "../redux/group/groupRx";
import * as privateGroupRxActions from "../redux/group/privateGroupRxActions";

import { IComponentProps } from "../utils/IComponentProps";
import { SMALL_TABLET, MEDIUM_HANDSET } from "../chitchat/consts/Breakpoints";

interface IComponentNameState {
    header: string;
}

class Main extends React.Component<IComponentProps, IComponentNameState> {

    menus = ["menu", "log out"];
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = 0;
    subHeaderHeight = null;
    bodyHeight = null;
    footerHeight = 0;

    componentWillMount() {
        this.state = {
            header: "Home"
        };

        const { teamReducer, stalkReducer, chatlogReducer, authReducer } = this.props;

        if (!teamReducer.team) {
            this.props.router.replace("/");
        }
        this.headerHeight = 56;
        this.footerHeight = 32;
        this.clientHeight = document.documentElement.clientHeight;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.footerHeight));

        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
        this.fetch_orgGroups = this.fetch_orgGroups.bind(this);
        this.fetch_privateGroups = this.fetch_privateGroups.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let {
            location: { query: { userId, username, roomId, contactId } },
            userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer
        } = nextProps;

        switch (userReducer.state) {
            case userRx.FETCH_AGENT_SUCCESS:
                this.joinChatServer(nextProps);
                break;
            default:
                if (!userReducer.user) {
                    this.props.router.push("/");
                }
                break;
        }

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_INIT_SUCCESS:
                if (this.props.stalkReducer.state !== StalkBridgeActions.STALK_INIT_SUCCESS) {
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
            case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
                this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                break;
            }
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                console.warn("GET_PERSISTEND_CHATROOM_FAILURE");
                break;
            }
            default:
                break;
        }
    }

    joinChatServer(nextProps: IComponentProps) {
        let { stalkReducer, userReducer } = nextProps;

        if (userReducer.user) {
            if (stalkReducer.state !== StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }

    fetch_privateChatRoom = (roommateId, owerId) => {
        this.props.dispatch(chatroomRx.fetchPrivateChatRoom(owerId, roommateId));
    }
    fetch_orgGroups = () => {
        this.props.dispatch(groupRx.getOrgGroup(this.props.teamReducer.team._id));
    }
    fetch_privateGroups = () => {
        this.props.dispatch(privateGroupRxActions.getPrivateGroup(this.props.teamReducer.team._id));
    }

    onSelectMenuItem(id, value) {
        console.log(this.menus[id]);

        let { authReducer } = this.props;
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
            <MuiThemeProvider>
                <div >
                    <div id={"toolbar"} style={{ height: this.headerHeight, overflowY: "hidden" }}>
                        <SimpleToolbar
                            title={(this.props.teamReducer.team) ? this.props.teamReducer.team.name : ""}
                            menus={this.menus}
                            onSelectedMenuItem={this.onSelectMenuItem} />
                    </div>
                    <div id={"app_body"} style={{ overflowY: "auto" }}>
                        <div style={{ overflowY: "auto" }}>
                            <ProfileEnhancer router={this.props.router} />
                            <ConnectGroupListEnhancer fetchGroup={() => this.fetch_orgGroups()}
                                groups={this.props.groupReducer.orgGroups}
                                subHeader={"OrgGroups"} />
                            <ConnectGroupListEnhancer
                                fetchGroup={() => { this.fetch_privateGroups(); }}
                                groups={this.props.groupReducer.privateGroups}
                                subHeader={"Groups"} />
                            <ContactBox {...this.props} />
                            <ChatLogsBoxEnhancer router={this.props.router} />
                            <SnackbarToolBox />
                        </div>
                    </div>
                    <div id={"app_footer"} style={{ height: this.footerHeight }}>
                        <StalkCompEnhancer />
                    </div>
                </div>
            </MuiThemeProvider >
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
