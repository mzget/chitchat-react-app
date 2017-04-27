"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const userRx_1 = require("../../redux/user/userRx");
const editGroupRxActions_1 = require("../../redux/group/editGroupRxActions");
const chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
const mapStateToProps = (state) => ({ userReducer: state.userReducer });
exports.AddMemberEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("search", "setSearch", ""), recompose_1.withState("members", "setMembers", []), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { searchUsers } = nextProps.userReducer;
        let { match: { params } } = nextProps;
        if (!recompose_1.shallowEqual(searchUsers, this.props.userReducer.searchUsers)) {
            if (Array.isArray(searchUsers)) {
                let room = chatroomActions.getRoom(params.room_id);
                let _members = searchUsers.filter(v => {
                    let _has = room.members.some(member => {
                        if (member._id == v._id) {
                            return true;
                        }
                    });
                    if (!_has) {
                        return v;
                    }
                });
                this.props.setMembers(members => _members);
            }
        }
    }
}), recompose_1.withHandlers({
    onSearch: (props) => () => {
        props.dispatch(userRx_1.suggestUser(props.search, null));
    },
    onAddMember: (props) => item => {
        props.dispatch(editGroupRxActions_1.addGroupMember(props.match.params.room_id, item));
    },
    onTextChanged: (props) => (e, value) => {
        props.setSearch(search => value);
    }
}));
