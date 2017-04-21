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
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ProfileBox_1 = require("./profile/ProfileBox");
const ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
const ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
const ContactBox_1 = require("./chatlist/ContactBox");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const StalkComponent_1 = require("./stalk/StalkComponent");
const AppBody_1 = require("./AppBody");
const StalkBridgeActions = require("../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const chatroomRx = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
const userRx = require("../redux/user/userRx");
const authRx = require("../redux/authen/authRx");
const groupRx = require("../redux/group/groupRx");
const privateGroupRxActions = require("../redux/group/privateGroupRxActions");
const Breakpoints_1 = require("../chitchat/consts/Breakpoints");
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.menus = ["menu", "log out"];
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = 0;
        this.subHeaderHeight = null;
        this.bodyHeight = null;
        this.footerHeight = 0;
        this.fetch_privateChatRoom = (roommateId, owerId) => {
            this.props.dispatch(chatroomRx.fetchPrivateChatRoom(owerId, roommateId));
        };
        this.fetch_orgGroups = () => {
            this.props.dispatch(groupRx.getOrgGroup(this.props.teamReducer.team._id));
        };
        this.fetch_privateGroups = () => {
            this.props.dispatch(privateGroupRxActions.getPrivateGroup(this.props.teamReducer.team._id));
        };
    }
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
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer } = nextProps;
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
                if (this.clientWidth < Breakpoints_1.MEDIUM_HANDSET)
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
    joinChatServer(nextProps) {
        let { stalkReducer, userReducer } = nextProps;
        if (userReducer.user) {
            if (stalkReducer.state !== StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
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
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                    React.createElement(SimpleToolbar_1.SimpleToolbar, { title: (this.props.teamReducer.team) ? this.props.teamReducer.team.name : "", menus: this.menus, onSelectedMenuItem: this.onSelectMenuItem })),
                React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
                    React.createElement(reflexbox_1.Flex, { flexColumn: false },
                        React.createElement(reflexbox_1.Flex, { flexColumn: true },
                            React.createElement("div", { style: { overflowY: "auto" } },
                                React.createElement(ProfileBox_1.ProfileEnhancer, { router: this.props.router }),
                                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: () => this.fetch_orgGroups(), groups: this.props.groupReducer.orgGroups, subHeader: "OrgGroups" }),
                                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: () => { this.fetch_privateGroups(); }, groups: this.props.groupReducer.privateGroups, subHeader: "Groups" }),
                                (this.clientWidth > Breakpoints_1.MEDIUM_HANDSET) ? null : React.createElement(ContactBox_1.default, __assign({}, this.props)),
                                React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, { router: this.props.router }),
                                React.createElement(SnackbarToolBox_1.SnackbarToolBox, null))),
                        (this.clientWidth > Breakpoints_1.MEDIUM_HANDSET) ? React.createElement(AppBody_1.ConnectedAppBody, null) : null,
                        (this.clientWidth > Breakpoints_1.MEDIUM_HANDSET) ? React.createElement(ContactBox_1.default, __assign({}, this.props)) : null)),
                React.createElement("div", { id: "app_footer", style: { height: this.footerHeight } },
                    React.createElement(StalkComponent_1.StalkCompEnhancer, null)))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Main);
