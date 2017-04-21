import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import { GET_PERSISTEND_CHATROOM_SUCCESS } from "../chitchat/chats/redux/chatroom/chatroomActions";
import { FETCH_PRIVATE_CHATROOM_SUCCESS } from "../chitchat/chats/redux/chatroom/chatroomRxEpic";

import { IComponentProps } from "../utils/IComponentProps";
import { SMALL_TABLET, MEDIUM_HANDSET } from "../chitchat/consts/Breakpoints";

export class AppBody extends React.Component<IComponentProps, any> {
    componentWillReceiveProps(nextProps: IComponentProps) {
        let { route, chatroomReducer } = nextProps;

        if (chatroomReducer.state == GET_PERSISTEND_CHATROOM_SUCCESS || chatroomReducer.state == FETCH_PRIVATE_CHATROOM_SUCCESS) {
            if (!shallowEqual(chatroomReducer.room, this.props.chatroomReducer.room)) {
                this.props.router.push(`/chatslist/chat/${chatroomReducer.room._id}`);
            }
        }
    }


    render() {
        let { chatroomReducer, params, userReducer, onError } = this.props;
        return (
            <div>
                {(params.filter == "profile") ?
                    <ProfileDetailEnhanced
                        user={userReducer.user}
                        teamProfile={userReducer.teamProfile}
                        alert={onError} /> :
                    (params.filter == "chat") ? <ChatPage /> : <Post />}
            </div>
        );
    }
}