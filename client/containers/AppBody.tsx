import * as React from "react";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { EnhanceEditGroupMember } from "./roomSettings/EditGroupMember";

interface IAppBody { match, onError, userReducer, chatroomReducer, teamReducer }

const getview = (props: IAppBody) => {
    let { match, onError, userReducer, chatroomReducer, teamReducer } = props;

    console.log("APPBODY", match.params);

    if (match.params.filter == "user") {
        return <ProfileDetailEnhanced
            user={userReducer.user}
            teamProfile={userReducer.teamProfile}
            alert={onError} />
    }
    else if (match.path.match("chatroom/chat")) {
        return <ChatPage match={match} onError={onError} />
    }
    else if (match.path.match("/chatroom/settings")) {
        if (match.params.edit == "edit") {
            return <GroupDetailEnhanced
                onError={onError}
                onFinished={() => console.log("Finished")} />
        }
        else if (match.params.edit == "add_member") {
            return <EnhanceEditGroupMember
                match={match}
                teamMembers={teamReducer.members}
                room_id={match.params.room_id}
                onFinished={() => console.log("Finished")} />
        }
    }
    else {
        return <Post />
    }
}

export const AppBody = (props: IAppBody) => (
    <div>   {
        getview(props)
    }
    </div>
);