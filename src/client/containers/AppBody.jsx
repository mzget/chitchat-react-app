import * as React from "react";
import Flexbox from "flexbox-react";
import FontIcon from 'material-ui/FontIcon';
import * as Colors from "material-ui/styles/colors";
import TextField from 'material-ui/TextField';
import { withState, compose } from "recompose";
import { withRouter } from "react-router-dom";
import { ChatPage } from "./Chat";
import { Post } from "./Post";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
import { AddMembersEnhanced } from "./roomSettings/AddMembers";
import { GroupDetailEnhanced } from "./roomSettings/GroupDetailEnhancer";
import { WithDialog } from "./toolsbox/DialogBoxEnhancer";
const onVideoCall = ({ history, roomName }) => {
    history.push(`/groupcall/${roomName}`);
};
const enhance = compose(WithDialog, withRouter, withState('roomName', 'setRoomName', ""));
var VideoCallCreateRoomSample = enhance(({ roomName, setRoomName, history, onError }) => (<div>
        <p> Videocall room experiment.</p>
        <TextField id="text-field-controlled" hintText="Enter videocall room name" value={roomName} onChange={(event) => setRoomName(event.target.value)}/>
        <FontIcon className="material-icons" style={{ marginRight: 24, fontSize: 48, cursor: 'pointer' }} color={Colors.lightGreen500} onClick={() => (roomName.length > 0) ?
    onVideoCall({ history, roomName }) :
    onError("Room name is missing")}>
            video_call
    </FontIcon>
    </div>));
;
const getview = (props) => {
    let { match, history, onError, userReducer } = props;
    if (match.params.filter == "user") {
        if (!userReducer.user) {
            return null;
        }
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
        return (<Flexbox flexDirection="column" alignItems={"center"} height="calc(100vh - 56px)">
                <Flexbox>
                    <VideoCallCreateRoomSample />
                </Flexbox>
                <Flexbox flexGrow={1}/>
                <Flexbox>
                    <Post />
                </Flexbox>
            </Flexbox>);
    }
};
export const AppBody = (props) => (<div>   {getview(props)}
    </div>);
