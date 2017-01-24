"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const teamRx = require("../../redux/team/teamRx");
const chatRoomActions = require("../../redux/chatroom/chatroomActions");
const MemberList_1 = require("./MemberList");
;
class ContactBox extends React.Component {
    componentWillMount() {
        console.log("ChatList", this.props);
        this.onselectMember = this.onselectMember.bind(this);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    onselectMember(data) {
        this._tempContact_id = data._id;
        this.props.dispatch(chatRoomActions.getPersistendChatroom(data._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Chats"),
            React.createElement(MemberList_1.MemberList, { value: this.props.teamReducer.members, onSelected: this.onselectMember })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactBox;
