import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RoomOverview } from "../components/RoomOverview";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMemberEnhanced";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
class ChatRoomSettingsOverView extends React.Component {
    componentWillMount() {
        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);
        if (!this.room) {
            this.props.history.replace("/");
        }
    }
    componentWillReceiveProps(nextProps) {
        let { match, chatroomReducer } = nextProps;
        if (!!chatroomReducer.room) {
            this.room = chatroomReducer.room;
        }
        if (!shallowEqual(match, this.props.match)) {
            if (!chatroomReducer.room)
                this.room = chatroomActions.getRoom(match.params.room_id);
        }
        if (!shallowEqual(chatroomReducer.chatrooms, this.props.chatroomReducer.chatrooms)) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    }
    render() {
        return (<MuiThemeProvider>
                <div style={{ height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" }}>
                    {(!!this.room)
            ? <RoomOverview room={this.room}/>
            : null}
                    <EditGroupMemberEnhanced members={this.room.members} room_id={this.room._id}/>
                </div>
            </MuiThemeProvider>);
    }
}
const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
export const ChatRoomOverview = connect(mapStateToProps)(ChatRoomSettingsOverView);
