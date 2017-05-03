import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { shallowEqual } from "recompose";

import { IComponentProps } from "../utils/IComponentProps";

import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMemberEnhanced";

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { Room, RoomType } from "../chitchat/libs/shared/Room";

class ChatRoomSettingsOverView extends React.Component<IComponentProps, any> {
    room: Room;

    componentWillMount() {
        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);
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
            <MuiThemeProvider >
                {(!!this.room) ? (
                    <div style={{ height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" }}>
                        <Flex flexColumn={false} align="center" style={{ margin: 5 }}>
                            {
                                (!!this.room && !!this.room.image) ? <Avatar
                                    src={this.room.image}
                                    size={32} /> :
                                    <Avatar>
                                        {(!!this.room && !!this.room.name) ? this.room.name.charAt(0) : null}
                                    </Avatar>
                            }
                            <span style={{ marginLeft: 5 }}>GROUP NAME : {(!!this.room && !!this.room.name) ? this.room.name : ""}</span>
                        </Flex>
                        <Flex flexColumn={false}>
                            <Subheader>TYPE : {RoomType[this.room.type].toUpperCase()}</Subheader>
                        </Flex>
                        <Flex flexColumn={false}>
                            <Subheader>DESCRIPTION : {this.room.description}</Subheader>
                        </Flex>
                        <Flex flexColumn={false}>
                            <Subheader>MEMBERS {this.room.members.length}</Subheader>
                        </Flex>
                        <EditGroupMemberEnhanced
                            members={this.room.members}
                            room_id={this.room._id} />
                    </div>
                ) : null}
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
export const ChatRoomOverview = connect(mapStateToProps)(ChatRoomSettingsOverView) as React.ComponentClass<{ match, onError }>;