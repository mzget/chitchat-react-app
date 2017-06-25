import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle, ComponentEnhancer } from "recompose";

import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

export interface IEnhanceProps {
    room_id: string;
    dispatch;
}

export const EditGroupMemberEnhancer = compose(
    connect(),
    withState("value", "setValue", "0"),
    withHandlers({
        removeItem: (props: IEnhanceProps) => (item) => {
            props.dispatch(editGroupRxActions.removeGroupMember(props.room_id, item._id));
        }
    })
) as ComponentEnhancer<IEnhanceProps, any>;