import { withHandlers, compose, lifecycle } from "recompose";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
export const GroupListEnhancer = compose(lifecycle({
    componentWillMount() {
        this.props.fetchGroup();
    }
}), withHandlers({
    onselectGroup: (props) => data => {
        props.dispatch(chatroomActions.leaveRoomAction());
        process.nextTick(() => {
            props.dispatch(chatroomActions.getPersistendChatroom(data._id));
        });
    }
}));
