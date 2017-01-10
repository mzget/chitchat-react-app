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
const react_router_1 = require("react-router");
const reflexbox_1 = require("reflexbox");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
const userActions = require("../redux/user/userActions");
const chatroomRxEpic = require("../redux/chatroom/chatroomRxEpic");
const chatroomActions = require("../redux/chatroom/chatroomActions");
const ChatLogsBox_1 = require("./ChatLogsBox");
const UtilsBox_1 = require("./UtilsBox");
class IComponentNameProps {
}
;
;
class Home extends React.Component {
    constructor() {
        super(...arguments);
        this.fetch_privateChatRoom = (roommateId, owerId) => {
            this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
        };
    }
    componentWillMount() {
        console.log("Home", this.props);
        this.state = {};
        let { location: { query: { userId, username, roomId, contactId, agent_name } } } = this.props;
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
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, chatlogReducer, userReducer, stalkReducer } = nextProps;
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
    joinChatServer(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer } = nextProps;
        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }
    render() {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, userReducer } = this.props;
        return (React.createElement("div", null,
            React.createElement(reflexbox_1.Flex, { px: 2, align: 'center' },
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                React.createElement("h2", null, "Stalk realtime messaging service."),
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
            React.createElement(reflexbox_1.Flex, { align: 'center' },
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                React.createElement("li", { key: userId },
                    React.createElement(react_router_1.Link, { to: `/chat/${userId}` }, username)),
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
            React.createElement(ChatLogsBox_1.default, __assign({}, this.props)),
            React.createElement(UtilsBox_1.default, null)));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Home);
