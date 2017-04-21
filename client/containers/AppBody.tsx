import * as React from "react";
import { connect } from "react-redux";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import { IComponentProps } from "../utils/IComponentProps";

export class AppBody extends React.Component<IComponentProps, any> {
    render() {
        let { params, userReducer, onError } = this.props;
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