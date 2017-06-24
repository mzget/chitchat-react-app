import * as React from "react";
import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { AddMembersEnhanced } from "./roomSettings/AddMembers";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";
;
const getview = (props) => {
    let { match, history, onError, userReducer } = props;
    if (match.params.filter == "user") {
        return React.createElement(ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError });
    }
    else if (match.path.match("chatroom")) {
        if (match.path.match("chatroom/chat")) {
            return React.createElement(ChatPage, { match: match, onError: onError, history: history });
        }
        else if (match.params.edit == "edit") {
            return React.createElement(GroupDetailEnhanced, { onError: onError, onFinished: () => console.log("Finished") });
        }
        else if (match.params.edit == "add_member") {
            return React.createElement(AddMembersEnhanced, { match: match });
        }
    }
    else {
        return React.createElement(Post, null);
    }
};
export const AppBody = (props) => (React.createElement("div", null,
    "   ",
    getview(props)));
