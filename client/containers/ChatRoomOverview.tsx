import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";
import { shallowEqual } from "recompose";


import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { RoomOverview, RoomHeader } from "../components/RoomOverview";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMemberEnhanced";

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { IComponentProps } from "../utils/IComponentProps";
import { Room, RoomType } from "../chitchat/chats/models/Room";

class ChatRoomSettingsOverView extends React.Component<IComponentProps, any> {
    room: Room;

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
        return (
            <MuiThemeProvider>
                <div style={{ height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" }}>
                    {
                        (!!this.room)
                            ? <RoomOverview room={this.room} />
                            : null
                    }
                    <EditGroupMemberEnhanced members={this.room.members} room_id={this.room._id} />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
export const ChatRoomOverview = connect(mapStateToProps)(ChatRoomSettingsOverView) as React.ComponentClass<{ match, onError }>;