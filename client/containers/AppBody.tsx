import * as React from "react";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

export const AppBody = ({ match, onError, userReducer, chatroomReducer }) => (
    <div>
        {
            (match.params.filter == "user") ?
                <ProfileDetailEnhanced
                    user={userReducer.user}
                    teamProfile={userReducer.teamProfile}
                    alert={onError} /> :
                (match.path.match("chatroom/chat")) ?
                    <ChatPage match={match} onError={onError} /> :
                    (match.path.match("/chatroom/settings")) ?
                        <GroupDetailEnhanced
                            onError={onError}
                            onFinished={() => console.log("Finished")} /> : <Post />
        }
    </div>
);