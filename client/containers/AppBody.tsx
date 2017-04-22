import * as React from "react";
import { connect } from "react-redux";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import { IComponentProps } from "../utils/IComponentProps";

export class AppBody extends React.Component<IComponentProps, any> {
    render() {
        let { match, userReducer, onError } = this.props;
        return (
            <div>
                {(match.params.filter == "user") ?
                    <ProfileDetailEnhanced
                        user={userReducer.user}
                        teamProfile={userReducer.teamProfile}
                        alert={onError} /> :
                    (match.params.filter == "chat") ? <ChatPage /> : <Post />}
            </div>
        );
    }
}