import * as React from "react";
import { WebRtcDemo } from "../webrtc/";
import { ChatPage } from "./Chat";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { AddMembersEnhanced } from "./roomSettings/AddMembers";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";
;
const getview = (props) => {
    let { match, history, onError, userReducer } = props;
    if (match.params.filter == "user") {
        return <ProfileDetailEnhanced user={userReducer.user} teamProfile={userReducer.teamProfile} alert={onError}/>;
    }
    else if (match.path.match("chatroom")) {
        if (match.path.match("chatroom/chat")) {
            return <ChatPage match={match} onError={onError} history={history}/>;
        }
        else if (match.params.edit == "edit") {
            return <GroupDetailEnhanced onError={onError} onFinished={() => console.log("Finished")}/>;
        }
        else if (match.params.edit == "add_member") {
            return <AddMembersEnhanced match={match}/>;
        }
    }
    else {
        return <WebRtcDemo />;
    }
};
export const AppBody = (props) => (<div>   {getview(props)}
    </div>);
