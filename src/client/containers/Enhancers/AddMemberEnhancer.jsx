import { connect } from "react-redux";
import { withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";
import { suggestUser } from "../../redux/user/userRx";
import { addGroupMember } from "../../redux/group/editGroupRxActions";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer
});
export const AddMemberEnhancer = compose(connect(mapStateToProps), withState("search", "setSearch", ""), withState("members", "setMembers", []), lifecycle({
    componentWillReceiveProps(nextProps) {
        let { searchUsers } = nextProps.userReducer;
        let { match: { params }, chatroomReducer } = nextProps;
        const update = (room) => {
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
        };
        if (!shallowEqual(searchUsers, this.props.userReducer.searchUsers)) {
            if (Array.isArray(searchUsers)) {
                let room = chatroomActions.getRoom(params.room_id);
                update(room);
            }
        }
        if (!shallowEqual(chatroomReducer.chatrooms, this.props.chatroomReducer.chatrooms)) {
            if (Array.isArray(searchUsers)) {
                let room = chatroomActions.getRoom(params.room_id);
                update(room);
            }
        }
    }
}), withHandlers({
    onSearch: (props) => () => {
        props.dispatch(suggestUser(props.search, props.teamReducer.team._id));
    },
    onAddMember: (props) => item => {
        props.dispatch(addGroupMember(props.match.params.room_id, item));
    },
    onTextChanged: (props) => (e, value) => {
        props.setSearch(search => value);
    }
}));
