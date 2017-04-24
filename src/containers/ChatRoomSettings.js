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
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Subheader_1 = require("material-ui/Subheader");
const EditGroupMember_1 = require("./roomSettings/EditGroupMember");
const GroupMemberEnhancer_1 = require("./roomSettings/GroupMemberEnhancer");
const chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
const Room_1 = require("../chitchat/libs/shared/Room");
const EDIT_GROUP = "EDIT_GROUP";
const EDIT_GROUP_MEMBERS = "EDIT_GROUP_MEMBERS";
const GROUP_MEMBERS = "GROUP_MEMBERS";
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isEditGroup"] = 1] = "isEditGroup";
    BoxState[BoxState["isEditMember"] = 2] = "isEditMember";
    BoxState[BoxState["viewMembers"] = 3] = "viewMembers";
})(BoxState || (BoxState = {}));
class ChatRoomSettings extends React.Component {
    constructor() {
        super(...arguments);
        this.menus = [EDIT_GROUP_MEMBERS, GROUP_MEMBERS];
    }
    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false
        };
        console.log("ChatRoomSettings", this.props);
        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);
        this.onMenuSelected = this.onMenuSelected.bind(this);
        this.getViewPanel = this.getViewPanel.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { match } = nextProps;
        if (!recompose_1.shallowEqual(match, this.props.match)) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    }
    getViewPanel() {
        let { match: { params }, teamReducer } = this.props;
        switch (this.state.boxState) {
            case BoxState.isEditMember:
                return React.createElement(EditGroupMember_1.ConnectEditGroupMember, { teamMembers: teamReducer.members, room_id: params.room_id, initMembers: this.room.members, onFinished: () => this.setState(prev => (__assign({}, prev, { boxState: BoxState.idle }))) });
            default:
                return null;
        }
    }
    onMenuSelected(key) {
        console.log("onMenuSelected", key);
        let room = this.room;
        // @Todo ...
        // Check room type and user permision for edit group details.
        if (key == EDIT_GROUP_MEMBERS) {
            if (room.type == Room_1.RoomType.privateGroup) {
                this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.isEditMember })));
            }
            else {
                this.props.onError("Request for valid group permission!");
            }
        }
        else if (key == EDIT_GROUP) {
            if (room.type == Room_1.RoomType.privateGroup) {
                this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.isEditGroup })));
            }
            else {
                this.props.onError("Request for valid group permission!");
            }
        }
        else if (key == GROUP_MEMBERS) {
            this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.viewMembers })));
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(reflexbox_1.Flex, { flexColumn: false },
                    React.createElement(Subheader_1.default, null,
                        "MEMBERS ",
                        this.room.members.length)),
                React.createElement(GroupMemberEnhancer_1.GroupMemberEnhancer, { members: this.room.members }))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
exports.ChatRoomSettingsPage = react_redux_1.connect(mapStateToProps)(ChatRoomSettings);
