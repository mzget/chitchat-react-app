import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";
import { shallowEqual } from "recompose";
import { withRouter } from "react-router-dom";


import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { RoomOverview, RoomHeader } from "../components/RoomOverview";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMemberEnhanced";

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { IComponentProps } from "../utils/IComponentProps";
import { Room, RoomType } from "../chitchat/chats/models/Room";

class ChatRoomOverView extends React.Component<IComponentProps, any> {
    room: Room;

    componentWillMount() {
        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { match, chatroomReducer } = nextProps;

        if (!!chatroomReducer.get("room")) {
            this.room = chatroomReducer.get("room");
        }
        if (!shallowEqual(match, this.props.match)) {
            if (!chatroomReducer.get("room"))
                this.room = chatroomActions.getRoom(match.params.room_id);
        }
        if (!shallowEqual(chatroomReducer.get("chatrooms"), this.props.chatroomReducer.get("chatrooms"))) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div style={{ height: "calc(100vh - 108px)", overflowY: "auto", overflowX: "hidden" }}>
                    {
                        (!!this.room)
                            ? (
                                <div>
                                    <RoomOverview room={this.room} />
                                    <EditGroupMemberEnhanced members={this.room.members} room_id={this.room._id} />
                                </div>
                            )
                            : null
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer
});
export var ChatRoomOverviewEnhanced = connect(mapStateToProps)(ChatRoomOverView) as React.ComponentClass<any>;
ChatRoomOverviewEnhanced = withRouter(ChatRoomOverviewEnhanced) as React.ComponentClass<{ onError }>;
