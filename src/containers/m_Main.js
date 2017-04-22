"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ProfileBox_1 = require("./profile/ProfileBox");
const ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
const ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
const ContactBox_1 = require("./chatlist/ContactBox");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const StalkComponent_1 = require("./stalk/StalkComponent");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const authRx = require("../redux/authen/authRx");
const groupRx = require("../redux/group/groupRx");
const privateGroupRxActions = require("../redux/group/privateGroupRxActions");
const chatroomActions_1 = require("../chitchat/chats/redux/chatroom/chatroomActions");
const chatroomRxEpic_1 = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
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
const mapStateToProps = (state) => (__assign({}, state));
const MainEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
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
        if (chatroomReducer.state == chatroomActions_1.GET_PERSISTEND_CHATROOM_SUCCESS ||
            chatroomReducer.state == chatroomRxEpic_1.FETCH_PRIVATE_CHATROOM_SUCCESS ||
            chatlogReducer.state == chatroomRxEpic_1.CREATE_PRIVATE_CHATROOM_SUCCESS) {
            if (!recompose_1.shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.history.push(`/chatroom/chat/${chatroomReducer.room._id}`);
            }
        }
    }
}), recompose_1.withHandlers({
    fetch_orgGroups: (props) => () => {
        props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
    },
    fetch_privateGroups: (props) => () => {
        props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
    }
}));
const M_Main = MainEnhancer(({ teamReducer, groupReducer, history, fetch_orgGroups, fetch_privateGroups }) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement("div", { id: "toolbar", style: { height: headerHeight, overflowY: "hidden" } },
            React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (teamReducer.team) ? teamReducer.team.name : "", menus: menus, onSelectedMenuItem: onSelectMenuItem })),
        React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
            React.createElement("div", { style: { overflowY: "auto" } },
                React.createElement(ProfileBox_1.ProfileEnhancer, { router: history }),
                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                React.createElement(ContactBox_1.ContactBox, null),
                React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, { router: history }),
                React.createElement(SnackbarToolBox_1.SnackbarToolBox, null))),
        React.createElement("div", { id: "app_footer", style: { height: footerHeight } },
            React.createElement(StalkComponent_1.StalkCompEnhancer, null))))));
exports.m_MainPage = M_Main;
