import * as React from "react";
import { connect } from "react-redux";
import { Flex } from "reflexbox";
import { shallowEqual } from "recompose";
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMemberEnhanced";
import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import { RoomType } from "../chitchat/shared/Room";
class ChatRoomSettingsOverView extends React.Component {
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
        return (React.createElement(MuiThemeProvider, null, (!!this.room) ? (React.createElement("div", { style: { height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden" } },
            React.createElement(Flex, { flexColumn: false, align: "center", style: { margin: 5 } },
                (!!this.room && !!this.room.image) ? React.createElement(Avatar, { src: this.room.image, size: 32 }) :
                    React.createElement(Avatar, null, (!!this.room && !!this.room.name) ? this.room.name.charAt(0) : null),
                React.createElement("span", { style: { marginLeft: 5 } },
                    "GROUP NAME : ",
                    (!!this.room && !!this.room.name) ? this.room.name : "")),
            React.createElement(Flex, { flexColumn: false },
                React.createElement(Subheader, null,
                    "TYPE : ",
                    RoomType[this.room.type].toUpperCase())),
            React.createElement(Flex, { flexColumn: false },
                React.createElement(Subheader, null,
                    "DESCRIPTION : ",
                    this.room.description)),
            React.createElement(Flex, { flexColumn: false },
                React.createElement(Subheader, null,
                    "MEMBERS ",
                    this.room.members.length)),
            React.createElement(EditGroupMemberEnhanced, { members: this.room.members, room_id: this.room._id }))) : null));
    }
}
const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
export const ChatRoomOverview = connect(mapStateToProps)(ChatRoomSettingsOverView);
