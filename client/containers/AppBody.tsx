import * as React from "react";
import { connect } from "react-redux";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import { IComponentProps } from "../utils/IComponentProps";
import { SMALL_TABLET, MEDIUM_HANDSET } from "../chitchat/consts/Breakpoints";

export class AppBody extends React.Component<IComponentProps, any> {
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
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
                    (chatroomReducer.room) ? <ChatPage /> : <Post />}
            </div>
        );
    }
}