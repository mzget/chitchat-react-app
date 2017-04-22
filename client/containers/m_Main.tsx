import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual, compose, withHandlers, withState, lifecycle } from "recompose";
import { Flex, Box } from "reflexbox";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ProfileEnhancer } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { ContactBox } from "./chatlist/ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";

import * as StalkBridgeActions from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as chatlogsActions from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as chatlogRxActions from "../chitchat/chats/redux/chatlogs/chatlogRxActions";
import * as chatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import * as userRx from "../redux/user/userRx";
import * as authRx from "../redux/authen/authRx";
import * as groupRx from "../redux/group/groupRx";
import * as privateGroupRxActions from "../redux/group/privateGroupRxActions";

import { GET_PERSISTEND_CHATROOM_SUCCESS } from "../chitchat/chats/redux/chatroom/chatroomActions";
import { FETCH_PRIVATE_CHATROOM_SUCCESS, CREATE_PRIVATE_CHATROOM_SUCCESS } from "../chitchat/chats/redux/chatroom/chatroomRxEpic";

import { IComponentProps } from "../utils/IComponentProps";
import { SMALL_TABLET, MEDIUM_HANDSET } from "../chitchat/consts/Breakpoints";

const menus = ["menu", "log out"];
const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;
const headerHeight = 0;
const subHeaderHeight = null;
const bodyHeight = null;
const footerHeight = 0;

function onSelectMenuItem(id, value) {
    console.log(this.menus[id]);

    let { authReducer } = this.props;
    switch (id) {
        case 0:
            this.props.history.push(`/admin/${authReducer.user}`);
            break;
        case 1:
            this.props.dispatch(authRx.logout(this.props.authReducer.token));
            break;
        default:
            break;
    }
}
const mapStateToProps = (state) => ({ ...state });

const MainEnhancer = compose(
    connect(mapStateToProps),
    lifecycle({
        componentWillReceiveProps(nextProps: IComponentProps) {
            let { location, userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer } = nextProps;

            if (!userReducer.user) {
                this.props.history.push("/");
            }

            switch (chatroomReducer.state) {
                case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                    console.warn("GET_PERSISTEND_CHATROOM_FAILURE");
                    break;
                }
                default:
                    break;
            }

            if (chatroomReducer.state == GET_PERSISTEND_CHATROOM_SUCCESS ||
                chatroomReducer.state == FETCH_PRIVATE_CHATROOM_SUCCESS ||
                chatlogReducer.state == CREATE_PRIVATE_CHATROOM_SUCCESS) {
                if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                    this.props.history.push(`/chatroom/chat/${chatroomReducer.room._id}`);
                }
            }
        }
    }),
    withHandlers({
        fetch_orgGroups: (props: any) => () => {
            props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
        },
        fetch_privateGroups: (props: any) => () => {
            props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
        }
    })
);

const M_Main = MainEnhancer(({ teamReducer, groupReducer, history, fetch_orgGroups, fetch_privateGroups }: any) => (
    <MuiThemeProvider>
        <div >
            <div id={"toolbar"} style={{ height: headerHeight, overflowY: "hidden" }}>
                <SimpleToolbar
                    title={(teamReducer.team) ? teamReducer.team.name : ""}
                    menus={menus}
                    onSelectedMenuItem={onSelectMenuItem} />
            </div>
            <div id={"app_body"} style={{ overflowY: "auto" }}>
                <div style={{ overflowY: "auto" }}>
                    <ProfileEnhancer router={history} />
                    <ConnectGroupListEnhancer fetchGroup={fetch_orgGroups}
                        groups={groupReducer.orgGroups}
                        subHeader={"OrgGroups"} />
                    <ConnectGroupListEnhancer
                        fetchGroup={fetch_privateGroups}
                        groups={groupReducer.privateGroups}
                        subHeader={"Groups"} />
                    <ContactBox />
                    <ChatLogsBoxEnhancer router={history} />
                    <SnackbarToolBox />
                </div>
            </div>
            <div id={"app_footer"} style={{ height: footerHeight }}>
                <StalkCompEnhancer />
            </div>
        </div>
    </MuiThemeProvider >
));

export const m_MainPage = M_Main;
