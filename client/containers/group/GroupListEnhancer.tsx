import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";

import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";

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
            props.dispatch(chatroomActions.getPersistendChatroom(data._id));
        }
    })
);