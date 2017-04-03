"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const teamRx = require("../../redux/team/teamRx");
const chatroomActions = require("../../chats/redux/chatroom/chatroomActions");
const chatroomRx = require("../../chats/redux/chatroom/chatroomRxEpic");
const MemberList_1 = require("./MemberList");
;
class ContactBox extends React.Component {
    componentWillMount() {
        console.log("ContactBox", this.props);
        this.onselectMember = this.onselectMember.bind(this);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, teamReducer, userReducer } = nextProps;
        switch (chatroomReducer.state) {
            case chatroomRx.FETCH_PRIVATE_CHATROOM_SUCCESS:
                if (chatroomReducer.room) {
                    this.props.router.push(`/chat/${chatroomReducer.room._id}`);
                }
                break;
            case chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE: {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id === this._tempContact_id;
                });
                let members = chatroomActions.createChatRoom(userReducer.user, contacts[0]);
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
        let { userReducer } = this.props;
        this._tempContact_id = data._id;
        this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, this._tempContact_id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Chats"),
            React.createElement(MemberList_1.MemberList, { items: this.props.teamReducer.members, onSelected: this.onselectMember })));
    }
}
exports.default = ContactBox;
