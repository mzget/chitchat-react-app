import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from "../components/SimpleToolbar";
import ProfileBox from "./profile/ProfileBox";
import OrgGroupListBox from "./group/OrgGroupListBox";
import PrivateGroupListBox from "./group/PrivateGroupListBox";
import ChatLogsBox from "./ChatLogsBox";
import ContactBox from "./chatlist/ContactBox";
import UtilsBox from "./UtilsBox";

import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as chatlogsActions from "../redux/chatlogs/chatlogsActions";
import * as chatroomRx from "../redux/chatroom/chatroomRxEpic";
import * as userRx from "../redux/user/userRx";
import * as authRx from "../redux/authen/authRx";
import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";

interface IComponentNameState {
    header: string;
};

class Main extends React.Component<IComponentProps, IComponentNameState> {

    menus = ["menu", "log out"];
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = null;
    subHeaderHeight = null;
    bodyHeight = null;
    footerHeight = null;

    componentWillMount() {
        this.state = {
            header: "Home"
        };
        const { teamReducer } = this.props;

        if (!teamReducer.team) {
            this.props.router.replace("/");
        }

        this.headerHeight = this.clientHeight * 0.1;
        this.bodyHeight = (this.clientHeight * 0.9);
        this.footerHeight = 50;

        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let {
            location: { query: { userId, username, roomId, contactId } },
            userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer
        } = nextProps;

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

        switch (chatlogReducer.state) {
            case chatlogsActions.STALK_INIT_CHATSLOG: {
                this.props.dispatch(chatlogsActions.getLastAccessRoom());
                break;
            }
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
                <div>
                    <div style={{ height: this.headerHeight }}>
                        <SimpleToolbar
                            title={this.props.teamReducer.team.name}
                            menus={this.menus}
                            onSelectedMenuItem={this.onSelectMenuItem} />
                    </div>
                    <div style={{ height: this.bodyHeight, overflowY: "auto" }}>
                        <ProfileBox {...this.props} />
                        <OrgGroupListBox {...this.props} />
                        <PrivateGroupListBox {...this.props} />
                        <ContactBox {...this.props} />
                        <ChatLogsBox {...this.props} />
                        <UtilsBox />
                    </div>
                    {
                        (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE) ?
                            (
                                <Flex style={{ height: this.footerHeight, backgroundColor: Colors.red500 }} align="center" justify="center" flexColumn={true}>
                                    <Flex flexColumn={true}>
                                        <span style={{ color: Colors.white }}>Unable to connect whit chat service.</span>
                                        <span style={{ color: Colors.white }}>Check your Internet connection.</span>
                                    </Flex>
                                </Flex>
                            ) : null
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
