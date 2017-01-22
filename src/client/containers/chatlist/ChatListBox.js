"use strict";
const React = require("react");
const teamRx = require("../../redux/team/teamRx");
const MemberList_1 = require("./MemberList");
;
class ChatListBox extends React.Component {
    componentWillMount() {
        console.log("ChatList", this.props);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(MemberList_1.MemberList, { value: this.props.teamReducer.members, onSelected: (data) => {
                    this.props.router.push(`/chat/${data._id}`);
                } })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatListBox;
