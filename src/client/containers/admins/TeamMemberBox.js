"use strict";
const React = require("react");
const MemberList_1 = require("../chatlist/MemberList");
;
class TeamMemberBox extends React.Component {
    componentWillMount() {
        this.onSelectMember = this.onSelectMember.bind(this);
    }
    componentWillReceiveProps(nextProps) {
    }
    onSelectMember(item) {
        console.dir(item);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(MemberList_1.MemberList, { onSelected: this.onSelectMember, value: this.props.teamReducer.members })));
    }
}
exports.TeamMemberBox = TeamMemberBox;
