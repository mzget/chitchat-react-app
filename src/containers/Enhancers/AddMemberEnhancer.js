"use strict";
exports.__esModule = true;
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var userRx_1 = require("../../redux/user/userRx");
var editGroupRxActions_1 = require("../../redux/group/editGroupRxActions");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var mapStateToProps = function (state) { return ({
    userReducer: state.userReducer,
    chatroomReducer: state.chatroomReducer
}); };
exports.AddMemberEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("search", "setSearch", ""), recompose_1.withState("members", "setMembers", []), recompose_1.lifecycle({
    componentWillReceiveProps: function (nextProps) {
        var _this = this;
        var searchUsers = nextProps.userReducer.searchUsers;
        var params = nextProps.match.params, chatroomReducer = nextProps.chatroomReducer;
        var update = function (room) {
            var _members = searchUsers.filter(function (v) {
                var _has = room.members.some(function (member) {
                    if (member._id == v._id) {
                        return true;
                    }
                });
                if (!_has) {
                    return v;
                }
            });
            _this.props.setMembers(function (members) { return _members; });
        };
        if (!recompose_1.shallowEqual(searchUsers, this.props.userReducer.searchUsers)) {
            if (Array.isArray(searchUsers)) {
                var room = chatroomActions.getRoom(params.room_id);
                update(room);
            }
        }
        if (!recompose_1.shallowEqual(chatroomReducer.chatrooms, this.props.chatroomReducer.chatrooms)) {
            if (Array.isArray(searchUsers)) {
                var room = chatroomActions.getRoom(params.room_id);
                update(room);
            }
        }
    }
}), recompose_1.withHandlers({
    onSearch: function (props) { return function () {
        props.dispatch(userRx_1.suggestUser(props.search, null));
    }; },
    onAddMember: function (props) { return function (item) {
        props.dispatch(editGroupRxActions_1.addGroupMember(props.match.params.room_id, item));
    }; },
    onTextChanged: function (props) { return function (e, value) {
        props.setSearch(function (search) { return value; });
    }; }
}));
