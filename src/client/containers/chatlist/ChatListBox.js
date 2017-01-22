"use strict";
const React = require("react");
const teamRx = require("../../redux/team/teamRx");
const chatRoomActions = require("../../redux/chatroom/chatroomActions");
const chatroomRx = require("../../redux/chatroom/chatroomRxEpic");
const MemberList_1 = require("./MemberList");
;
class ChatListBox extends React.Component {
    componentWillMount() {
        console.log("ChatList", this.props);
        this.onselectMember = this.onselectMember.bind(this);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, chatroomReducer, teamReducer } = nextProps;
        switch (chatroomReducer.state) {
            case chatRoomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
                this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                break;
            }
            case chatRoomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, this._tempContact_id));
                break;
            }
            case chatroomRx.FETCH_PRIVATE_CHATROOM_SUCCESS:
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
                break;
            case chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE: {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id == this._tempContact_id;
                });
                let members = chatRoomActions.createChatRoom(userReducer.user, contacts[0]);
                this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
                break;
            }
            case chatroomRx.CREATE_PRIVATE_CHATROOM_SUCCESS: {
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
            }
            default:
                break;
        }
    }
    onselectMember(data) {
        this._tempContact_id = data._id;
        this.props.dispatch(chatRoomActions.getPersistendChatroom(data._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(MemberList_1.MemberList, { value: this.props.teamReducer.members, onSelected: this.onselectMember })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatListBox;
