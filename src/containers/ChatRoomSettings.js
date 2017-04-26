"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const recompose_1 = require("recompose");
const Avatar_1 = require("material-ui/Avatar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Subheader_1 = require("material-ui/Subheader");
const EditGroupMemberEnhanced_1 = require("./roomSettings/EditGroupMemberEnhanced");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
class ChatRoomSettingsOverView extends React.Component {
    componentWillMount() {
        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);
    }
    componentWillReceiveProps(nextProps) {
        let { match } = nextProps;
        if (!recompose_1.shallowEqual(match, this.props.match)) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", { style: { height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" } },
                React.createElement(reflexbox_1.Flex, { flexColumn: false, align: "center", style: { margin: 5 } },
                    (this.room.image) ? React.createElement(Avatar_1.default, { src: this.room.image, size: 32 }) :
                        React.createElement(Avatar_1.default, null, this.room.name.charAt(0)),
                    React.createElement("span", { style: { marginLeft: 5 } },
                        "GROUP NAME : ",
                        this.room.name)),
                React.createElement(reflexbox_1.Flex, { flexColumn: false },
                    React.createElement(Subheader_1.default, null,
                        "DESCRIPTION : ",
                        this.room.description)),
                React.createElement(reflexbox_1.Flex, { flexColumn: false },
                    React.createElement(Subheader_1.default, null,
                        "MEMBERS ",
                        this.room.members.length)),
                React.createElement(EditGroupMemberEnhanced_1.EditGroupMemberEnhanced, { match: this.props.match, members: this.room.members, room_id: this.room._id, onFinished: () => console.log("Edit group") }))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
exports.ChatRoomSettingsPage = react_redux_1.connect(mapStateToProps)(ChatRoomSettingsOverView);
