"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const recompose_1 = require("recompose");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const RaisedButton_1 = require("material-ui/RaisedButton");
const MemberList_1 = require("../chatlist/MemberList");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
const enhance = recompose_1.compose(recompose_1.withState("members", "updateMembers", []), recompose_1.lifecycle({
    componentWillMount() {
        this.props.updateMembers(member => this.props.initMembers);
    }
}), recompose_1.withHandlers({
    onToggleItem: (props) => (item, checked) => {
        if (checked) {
            props.members.push(item);
        }
        else {
            let index = props.members.indexOf(item);
            props.members.splice(index, 1);
        }
    },
    onSubmit: (props) => event => {
        console.log(props);
        let payload = { room_id: props.room_id, members: props.members };
        props.dispatch(editGroupRxActions.editGroupMember(payload));
    }
}));
const EditGroupMember = enhance(({ onToggleItem, onSubmit, teamMembers, room_id, initMembers }) => React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(MemberList_1.MemberList, { onSelected: null, value: teamMembers, rightToggle: true, onToggleItem: onToggleItem }),
        React.createElement(RaisedButton_1.default, { label: "Submit", primary: true, onClick: onSubmit }))));
exports.ConnectEditGroupMember = react_redux_1.connect()(EditGroupMember);
