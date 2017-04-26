import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, lifecycle, ComponentEnhancer } from "recompose";

import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

export interface IEnhanceProps {
    members: Array<ChitChatAccount>;
    teamMembers: Array<ChitChatAccount>;
    room_id: string;
    updateMembers;
    onSubmit;
    onFinished: () => void;
    onToggleItem: (item, checked) => void;
    dispatch;
}

export const EditGroupMemberEnhancer = compose(
    connect(),
    // withState("members", "updateMembers", []),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            // let { params } = nextProps.match;
            // if (nextProps.match != this.props.match) {
            //     let room = chatroomActions.getRoom(params.room_id);

            //     this.props.updateMembers(members => room.members);
            // }
        }
    }),
    withHandlers({
        onToggleItem: (props: IEnhanceProps) => (item, checked) => {
            if (checked) {
                props.members.push(item);
                props.updateMembers((members: Array<ChitChatAccount>) => props.members);
            }
            else {
                let index = props.members.indexOf(item);
                props.members.splice(index);
                props.updateMembers((members: Array<ChitChatAccount>) => props.members);
            }
        },
        onSubmit: (props: IEnhanceProps) => event => {
            let payload = { room_id: props.room_id, members: props.members };
            props.dispatch(editGroupRxActions.editGroupMember(payload));

            props.onFinished();
        }
    })
);