"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const recompose_1 = require("recompose");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const RaisedButton_1 = require("material-ui/RaisedButton");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Avatar_1 = require("material-ui/Avatar");
const Toggle_1 = require("material-ui/Toggle");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
const enhance = recompose_1.compose(recompose_1.withState("members", "updateMembers", ({ initMembers }) => initMembers), 
// lifecycle({
//     componentWillMount() {
//         this.props.updateMembers(member => this.props.initMembers);
//     }
// }),
recompose_1.withHandlers({
    onToggleItem: (props) => (item, checked) => {
        if (checked) {
            props.members.push(item);
            props.updateMembers((members) => props.members);
        }
        else {
            let index = props.members.indexOf(item);
            props.members.splice(index);
            props.updateMembers((members) => props.members);
        }
    },
    onSubmit: (props) => event => {
        let payload = { room_id: props.room_id, members: props.members };
        props.dispatch(editGroupRxActions.editGroupMember(payload));
        props.onFinished();
    }
}));
const EditGroupMember = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        console.log(props),
        React.createElement(List_1.List, null,
            " ",
            (props.teamMembers && props.teamMembers.length > 0) ?
                props.teamMembers.map((item, i, arr) => {
                    let _isContain = props.members.some((member, id, arr) => {
                        if (member._id == item._id) {
                            return true;
                        }
                    });
                    return (React.createElement("div", { key: i },
                        React.createElement(List_1.ListItem, { leftAvatar: (!!item.avatar) ?
                                React.createElement(Avatar_1.default, { src: item.avatar }) : React.createElement(Avatar_1.default, null, item.username.charAt(0)), rightToggle: React.createElement(Toggle_1.default, { onToggle: (event, isInputChecked) => {
                                    props.onToggleItem(item, isInputChecked);
                                }, defaultToggled: _isContain }), primaryText: item.username, secondaryText: React.createElement("p", null,
                                React.createElement("span", { style: { color: Colors.darkBlack } }, item.email)) }),
                        React.createElement(Divider_1.default, { inset: true })));
                }) : null),
        React.createElement(Divider_1.default, { inset: true }),
        React.createElement(RaisedButton_1.default, { label: "Submit", primary: true, onClick: props.onSubmit }))));
const EnhanceEditGroupMember = enhance(({ teamMembers, initMembers, room_id, members, updateMembers, onToggleItem, onSubmit, onFinished }) => React.createElement(EditGroupMember, { teamMembers: teamMembers, members: members, onToggleItem: onToggleItem, onSubmit: onSubmit }));
exports.ConnectEditGroupMember = react_redux_1.connect()(EnhanceEditGroupMember);
