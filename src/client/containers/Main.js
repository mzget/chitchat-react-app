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
const userActions = require("../redux/user/userActions");
const chatroomRxEpic = require("../redux/chatroom/chatroomRxEpic");
const chatroomActions = require("../redux/chatroom/chatroomActions");
const ChatLogsBox_1 = require("./ChatLogsBox");
const TeamListBox_1 = require("./teams/TeamListBox");
const Toolbar_1 = require("../components/Toolbar");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
class IComponentNameProps {
}
;
;
/**
 * Containers of chatlist, chatlogs, etc...
 */
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.fetch_privateChatRoom = (roommateId, owerId) => {
            this.props.dispatch(chatroomRxEpic.fetchPrivateChatRoom(owerId, roommateId));
        };
    }
    componentWillMount() {
        console.log("Main", this.props);
        let { location: { query: { userId, username, roomId, contactId, agent_name } }, params } = this.props;
        if (params.filter) {
            this.props.dispatch(userActions.fetchUser(params.filter));
        }
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer } = nextProps;
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
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer } = nextProps;
        if (userReducer.user) {
            if (stalkReducer.state != StalkBridgeActions.STALK_INIT) {
                StalkBridgeActions.stalkLogin(userReducer.user);
            }
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Toolbar_1.default, { title: 'ChatList' }),
            React.createElement(TeamListBox_1.default, null),
            React.createElement(ChatLogsBox_1.default, __assign({}, this.props))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Main);
