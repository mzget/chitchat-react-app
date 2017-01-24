"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const chatRoomActions = require("../../redux/chatroom/chatroomActions");
const groupRx = require("../../redux/group/groupRx");
const GroupList_1 = require("./GroupList");
;
class OrgGroupListBox extends React.Component {
    componentWillMount() {
        console.log("GroupList", this.props);
        this.onselectGroup = this.onselectGroup.bind(this);
        this.props.dispatch(groupRx.getOrgGroup(this.props.teamReducer.team._id));
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, chatroomReducer, teamReducer } = nextProps;
    }
    onselectGroup(data) {
        this.props.dispatch(chatRoomActions.getPersistendChatroom(data._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Org-Group"),
            React.createElement(GroupList_1.GroupList, { values: this.props.groupReducer.orgGroups, onSelected: this.onselectGroup })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrgGroupListBox;