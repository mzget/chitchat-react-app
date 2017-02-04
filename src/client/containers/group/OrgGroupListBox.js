"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const chatroomActions = require("../../redux/chatroom/chatroomActions");
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
        let { chatroomReducer, teamReducer, userReducer } = nextProps;
        switch (chatroomReducer.state) {
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                //     this.props.dispatch(WTF);
                break;
            }
            default:
                break;
        }
    }
    onselectGroup(data) {
        this.props.dispatch(chatroomActions.getPersistendChatroom(data._id));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Org-Group"),
            React.createElement(GroupList_1.GroupList, { values: this.props.groupReducer.orgGroups, onSelected: this.onselectGroup })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrgGroupListBox;
