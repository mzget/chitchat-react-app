import * as React from "react";
import Flexbox from "flexbox-react";
import FontIcon from 'material-ui/FontIcon';
import * as Colors from "material-ui/styles/colors";

import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { AddMembersEnhanced } from "./roomSettings/AddMembers";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";

interface IAppBody { match, history, onError, userReducer };


const onVideoCall = ({ history }) => {
    history.push(`/videocall/exe`);
};

const getview = (props: IAppBody) => {
    let { match, history, onError, userReducer } = props;

    if (match.params.filter == "user") {
        if (!userReducer.user) {
            return null;
        }

        return <ProfileDetailEnhanced
            user={userReducer.user}
            teamProfile={userReducer.teamProfile}
            alert={onError}
        />
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
            return <AddMembersEnhanced match={match} />
        }
    }
    else {
        return (
            <Flexbox flexDirection="row" alignItems={"center"}>
                <Post />
                <FontIcon
                    className="material-icons"
                    style={{ marginRight: 24, fontSize: 48, cursor: 'pointer' }}
                    color={Colors.lightGreen500}
                    onClick={() => onVideoCall({ history })}
                >
                    video_call
                    </FontIcon>
            </Flexbox>
        )
    }
}

export const AppBody = (props: IAppBody) => (
    <div>   {
        getview(props)
    }
    </div>
);