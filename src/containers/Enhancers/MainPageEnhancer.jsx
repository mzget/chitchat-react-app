import { connect } from "react-redux";
import { shallowEqual, compose, withHandlers, withState, lifecycle } from "recompose";
import * as groupRx from "../../redux/group/groupRx";
import * as privateGroupRxActions from "../../redux/group/privateGroupRxActions";
import { GET_PERSISTEND_CHATROOM_SUCCESS } from "../../chitchat/chats/redux/chatroom/chatroomActions";
import { FETCH_PRIVATE_CHATROOM_SUCCESS, CREATE_PRIVATE_CHATROOM_SUCCESS } from "../../chitchat/chats/redux/chatroom/chatroomRxEpic";
const mapStateToProps = (state) => (Object.assign({}, state));
export const MainPageEnhancer = compose(connect(mapStateToProps), withState("teamname", "setTeamName", ({ teamReducer }) => (!!teamReducer.team) ? teamReducer.team.name : ""), lifecycle({
    componentWillReceiveProps(nextProps) {
        let { userReducer, chatroomReducer, teamReducer } = nextProps;
        if (!userReducer.user) {
            this.props.history.push("/");
        }
        if (chatroomReducer.state == GET_PERSISTEND_CHATROOM_SUCCESS ||
            chatroomReducer.state == FETCH_PRIVATE_CHATROOM_SUCCESS ||
            chatroomReducer.state == CREATE_PRIVATE_CHATROOM_SUCCESS) {
            if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.history.push(`/chatroom/chat/${chatroomReducer.room._id}`);
            }
        }
    }
}), withHandlers({
    fetch_orgGroups: (props) => () => {
        if (!props.teamReducer.team)
            return props.history.replace(`/`);
        props.dispatch(groupRx.getOrgGroup(props.teamReducer.team._id));
    },
    fetch_privateGroups: (props) => () => {
        if (!props.teamReducer.team)
            return props.history.replace(`/`);
        props.dispatch(privateGroupRxActions.getPrivateGroup(props.teamReducer.team._id));
    }
}));
