"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const Subheader_1 = require("material-ui/Subheader");
const teamRx = require("../../redux/team/teamRx");
const chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
const chatroomRx = require("../../chitchat/chats/redux/chatroom/chatroomRxEpic");
const MemberList_1 = require("./MemberList");
class ContactBox extends React.Component {
    componentDidMount() {
        this.onselectMember = this.onselectMember.bind(this);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, teamReducer, userReducer } = nextProps;
        if (!recompose_1.shallowEqual(chatroomReducer, this.props.chatroomReducer)) {
            console.log(chatroomReducer.state);
            if (chatroomReducer.state == chatroomRx.FETCH_PRIVATE_CHATROOM_FAILURE) {
                let contacts = teamReducer.members.filter((v, i) => {
                    return v._id === this._tempContact_id;
                });
                let members = chatroomActions.createChatRoom(userReducer.user, contacts[0]);
                this.props.dispatch(chatroomRx.createPrivateChatRoom(members.owner, members.contact));
            }
        }
    }
    onselectMember(data) {
        let { userReducer } = this.props;
        this._tempContact_id = data._id;
        this.props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() => this.props.dispatch(chatroomRx.fetchPrivateChatRoom(userReducer.user._id, this._tempContact_id)));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Chats"),
            React.createElement(MemberList_1.MemberList, { items: this.props.teamReducer.members, onSelected: this.onselectMember })));
    }
}
exports.ContactBox = ContactBox;
