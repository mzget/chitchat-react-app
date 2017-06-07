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
        return (<MuiThemeProvider_1.default>
                {(!!this.room) ? (<div style={{ height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" }}>
                        <reflexbox_1.Flex flexColumn={false} align="center" style={{ margin: 5 }}>
                            {(!!this.room && !!this.room.image) ? <Avatar_1.default src={this.room.image} size={32}/> :
            <Avatar_1.default>
                                        {(!!this.room && !!this.room.name) ? this.room.name.charAt(0) : null}
                                    </Avatar_1.default>}
                            <span style={{ marginLeft: 5 }}>GROUP NAME : {(!!this.room && !!this.room.name) ? this.room.name : ""}</span>
                        </reflexbox_1.Flex>
                        <reflexbox_1.Flex flexColumn={false}>
                            <Subheader_1.default>TYPE : {Room_1.RoomType[this.room.type].toUpperCase()}</Subheader_1.default>
                        </reflexbox_1.Flex>
                        <reflexbox_1.Flex flexColumn={false}>
                            <Subheader_1.default>DESCRIPTION : {this.room.description}</Subheader_1.default>
                        </reflexbox_1.Flex>
                        <reflexbox_1.Flex flexColumn={false}>
                            <Subheader_1.default>MEMBERS {this.room.members.length}</Subheader_1.default>
                        </reflexbox_1.Flex>
                        <EditGroupMemberEnhanced_1.EditGroupMemberEnhanced members={this.room.members} room_id={this.room._id}/>
                    </div>) : null}
            </MuiThemeProvider_1.default>);
    };
    return ChatRoomSettingsOverView;
}(React.Component));
var mapStateToProps = function (state) { return ({
    chatroomReducer: state.chatroomReducer
}); };
exports.ChatRoomOverview = react_redux_1.connect(mapStateToProps)(ChatRoomSettingsOverView);
