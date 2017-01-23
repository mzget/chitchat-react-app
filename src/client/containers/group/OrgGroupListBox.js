"use strict";
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const GroupList_1 = require("./GroupList");
;
class OrgGroupListBox extends React.Component {
    componentWillMount() {
        console.log("GroupList", this.props);
        this.onselectGroup = this.onselectGroup.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, userReducer, stalkReducer, chatroomReducer, teamReducer } = nextProps;
    }
    onselectGroup(data) {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Subheader_1.default, null, "Org-Group"),
            React.createElement(GroupList_1.GroupList, { values: null, onSelected: this.onselectGroup })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrgGroupListBox;
