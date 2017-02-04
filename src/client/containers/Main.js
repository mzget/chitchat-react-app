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
const Colors = require("material-ui/styles/colors");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ProfileBox_1 = require("./profile/ProfileBox");
const OrgGroupListBox_1 = require("./group/OrgGroupListBox");
const ChatLogsBox_1 = require("./ChatLogsBox");
const ContactBox_1 = require("./chatlist/ContactBox");
const UtilsBox_1 = require("./UtilsBox");
const chatroomActions = require("../redux/chatroom/chatroomActions");
const chatlogsActions = require("../redux/chatlogs/chatlogsActions");
const chatroomRx = require("../redux/chatroom/chatroomRxEpic");
const userRx = require("../redux/user/userRx");
const authRx = require("../redux/authen/authRx");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
;
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.menus = ["admin", "log out"];
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = null;
        this.bodyHeight = null;
        this.footerHeight = null;
        this.fetch_privateChatRoom = (roommateId, owerId) => {
            this.props.dispatch(chatroomRx.fetchPrivateChatRoom(owerId, roommateId));
        };
    }
    componentWillMount() {
        this.state = {
            header: "Home"
        };
        const { teamReducer } = this.props;
        if (!teamReducer.team) {
            this.props.router.replace("/");
        }
        this.headerHeight = this.clientHeight * 0.1;
        this.bodyHeight = (this.clientHeight * 0.9) - 50;
        this.footerHeight = 50;
        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, chatroomReducer, teamReducer, chatlogReducer } = nextProps;
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
                React.createElement("div", { style: { height: this.headerHeight } },
                    React.createElement(SimpleToolbar_1.default, { title: this.props.teamReducer.team.name, menus: this.menus, onSelectedMenuItem: this.onSelectMenuItem })),
                React.createElement("div", { style: { height: this.bodyHeight, overflowY: "auto" } },
                    React.createElement(ProfileBox_1.default, __assign({}, this.props)),
                    React.createElement(OrgGroupListBox_1.default, __assign({}, this.props)),
                    React.createElement(ContactBox_1.default, __assign({}, this.props)),
                    React.createElement(ChatLogsBox_1.default, __assign({}, this.props)),
                    React.createElement(UtilsBox_1.default, null)),
                (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE) ?
                    (React.createElement(reflexbox_1.Flex, { style: { height: this.footerHeight, backgroundColor: Colors.red500 }, align: "center", justify: "center", flexColumn: true },
                        React.createElement(reflexbox_1.Flex, { flexColumn: true },
                            React.createElement("span", { style: { color: Colors.white } }, "Unable to connect whit chat service."),
                            React.createElement("span", { style: { color: Colors.white } }, "Check your Internet connection.")))) : null)));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Main);
