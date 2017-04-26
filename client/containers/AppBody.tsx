import * as React from "react";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMember";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";

interface IAppBody { match, history, onError, userReducer }

const getview = (props: IAppBody) => {
    let { match, history, onError, userReducer } = props;

    if (match.params.filter == "user") {
        return <ProfileDetailEnhanced
            user={userReducer.user}
            teamProfile={userReducer.teamProfile}
            alert={onError} />
    }
    else if (match.path.match("chatroom")) {
        if (match.path.match("chatroom/chat")) {
            return <ChatPage match={match} onError={onError} history={history} />
        }
        else if (match.params.edit == "edit") {
            return <GroupDetailEnhanced
                onError={onError}
                onFinished={() => console.log("Finished")} />
        }
        else if (match.params.edit == "add_member") {
            return <EditGroupMemberEnhanced
                match={match}
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