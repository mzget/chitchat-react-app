"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_redux_1 = require("react-redux");
var reflexbox_1 = require("reflexbox");
var recompose_1 = require("recompose");
var Avatar_1 = require("material-ui/Avatar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Subheader_1 = require("material-ui/Subheader");
var EditGroupMemberEnhanced_1 = require("./roomSettings/EditGroupMemberEnhanced");
var chatroomActions = require("../chitchat/chats/redux/chatroom/chatroomActions");
var Room_1 = require("../chitchat/shared/Room");
var ChatRoomSettingsOverView = (function (_super) {
    __extends(ChatRoomSettingsOverView, _super);
    function ChatRoomSettingsOverView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatRoomSettingsOverView.prototype.componentWillMount = function () {
        var params = this.props.match.params;
        this.room = chatroomActions.getRoom(params.room_id);
    };
    ChatRoomSettingsOverView.prototype.componentWillReceiveProps = function (nextProps) {
        var match = nextProps.match, chatroomReducer = nextProps.chatroomReducer;
        if (!!chatroomReducer.room) {
            this.room = chatroomReducer.room;
        }
        if (!recompose_1.shallowEqual(match, this.props.match)) {
            if (!chatroomReducer.room)
                this.room = chatroomActions.getRoom(match.params.room_id);
        }
        if (!recompose_1.shallowEqual(chatroomReducer.chatrooms, this.props.chatroomReducer.chatrooms)) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    };
    ChatRoomSettingsOverView.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null, (!!this.room) ? (React.createElement("div", { style: { height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" } },
            React.createElement(reflexbox_1.Flex, { flexColumn: false, align: "center", style: { margin: 5 } },
                (!!this.room && !!this.room.image) ? React.createElement(Avatar_1["default"], { src: this.room.image, size: 32 }) :
                    React.createElement(Avatar_1["default"], null, (!!this.room && !!this.room.name) ? this.room.name.charAt(0) : null),
                React.createElement("span", { style: { marginLeft: 5 } },
                    "GROUP NAME : ",
                    (!!this.room && !!this.room.name) ? this.room.name : "")),
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(Subheader_1["default"], null,
                    "TYPE : ",
                    Room_1.RoomType[this.room.type].toUpperCase())),
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(Subheader_1["default"], null,
                    "DESCRIPTION : ",
                    this.room.description)),
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(Subheader_1["default"], null,
                    "MEMBERS ",
                    this.room.members.length)),
            React.createElement(EditGroupMemberEnhanced_1.EditGroupMemberEnhanced, { members: this.room.members, room_id: this.room._id }))) : null));
    };
    return ChatRoomSettingsOverView;
}(React.Component));
var mapStateToProps = function (state) { return ({
    chatroomReducer: state.chatroomReducer
}); };
exports.ChatRoomOverview = react_redux_1.connect(mapStateToProps)(ChatRoomSettingsOverView);
