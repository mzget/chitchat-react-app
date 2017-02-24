"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const chatroomActions = require("../../redux/chatroom/chatroomActions");
const privateGroupRxActions = require("../../redux/group/privateGroupRxActions");
const GroupList_1 = require("./GroupList");
;
class PrivateGroupListBox extends React.Component {
    componentWillMount() {
        console.log("PrivateGroupListBox", this.props);
        this.onselectGroup = this.onselectGroup.bind(this);
        this.props.dispatch(privateGroupRxActions.getPrivateGroup(this.props.teamReducer.team._id));
    }
    onselectGroup(data) {
        this.props.dispatch(chatroomActions.getPersistendChatroom(data._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Groups"),
            React.createElement(GroupList_1.GroupList, { values: this.props.groupReducer.privateGroups, onSelected: this.onselectGroup })));
    }
}
exports.default = PrivateGroupListBox;
