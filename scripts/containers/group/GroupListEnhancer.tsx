import * as React from "react";
import { connect } from "react-redux";
import { withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";

import * as chatroomActions from "stalk-simplechat/app/redux/chatroom/chatroomActions";

interface IEnhanceProps {
    dispatch;
    fetchGroup: () => void;
}

export const GroupListEnhancer = compose(
    lifecycle({
        componentWillMount() {
            this.props.fetchGroup();
        }
    }),
    withHandlers({
        onselectGroup: (props: IEnhanceProps) => data => {
            props.dispatch(chatroomActions.leaveRoomAction());
            process.nextTick(() => {
                props.dispatch(chatroomActions.getPersistendChatroom(data._id));
            });
        }
    })
);