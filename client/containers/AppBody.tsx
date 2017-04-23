import * as React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import { IComponentProps } from "../utils/IComponentProps";

const mapStateToProps = (state) => ({ ...state });
const enhance = compose(
    connect(mapStateToProps)
);

export const AppBody = enhance(({ match, userReducer, onError }: IComponentProps) => (
    <div>
        {(match.params.filter == "user") ?
            <ProfileDetailEnhanced
                user={userReducer.user}
                teamProfile={userReducer.teamProfile}
                alert={onError} /> :
            (match.params.filter == "chat") ? <ChatPage /> : <Post />}
    </div>
)) as React.ComponentClass<{ match, userReducer, onError }>;
