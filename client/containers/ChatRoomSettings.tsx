import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { shallowEqual } from "recompose";

import { IComponentProps } from "../utils/IComponentProps";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { MenuListview } from "./admins/MenuListView";
import { EditGroupMemberEnhanced } from "./roomSettings/EditGroupMember";

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { Room, RoomType } from "../chitchat/libs/shared/Room";

const EDIT_GROUP = "EDIT_GROUP";
const EDIT_GROUP_MEMBERS = "EDIT_GROUP_MEMBERS";
const GROUP_MEMBERS = "GROUP_MEMBERS";
enum BoxState {
    idle = 0, isEditGroup = 1, isEditMember, viewMembers
}
interface IComponentState {
    boxState: BoxState;
    alert: boolean;
}
class ChatRoomSettings extends React.Component<IComponentProps, IComponentState> {
    menus = [EDIT_GROUP_MEMBERS, GROUP_MEMBERS];
    room: Room;

    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false
        };

        console.log("ChatRoomSettings", this.props);

        let { match: { params } } = this.props;
        this.room = chatroomActions.getRoom(params.room_id);

        this.onMenuSelected = this.onMenuSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { match } = nextProps;

        if (!shallowEqual(match, this.props.match)) {
            this.room = chatroomActions.getRoom(match.params.room_id);
        }
    }

    onMenuSelected(key: string) {
        console.log("onMenuSelected", key);

        let room = this.room;
        // @Todo ...
        // Check room type and user permision for edit group details.
        if (key == EDIT_GROUP_MEMBERS) {
            if (room.type == RoomType.privateGroup) {
                this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditMember }));
            }
            else {
                this.props.onError("Request for valid group permission!");
            }
        }
        else if (key == EDIT_GROUP) {
            if (room.type == RoomType.privateGroup) {
                this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditGroup }));
            }
            else {
                this.props.onError("Request for valid group permission!");
            }
        }
        else if (key == GROUP_MEMBERS) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.viewMembers }));
        }
    }

    render() {
        return (
            <MuiThemeProvider >
                <div style={{height: "calc(100vh - 108px)", overflowY: "scroll", overflowX: "hidden"}}>
                    <Flex flexColumn={false}>
                        <Subheader>NAME : {this.room.name}</Subheader>
                    </Flex>
                    <Flex flexColumn={false}>
                        <Subheader>DESCRIPTION : {this.room.description}</Subheader>
                    </Flex>
                    <Flex flexColumn={false}>
                        <Subheader>MEMBERS {this.room.members.length}</Subheader>
                    </Flex>
                    <EditGroupMemberEnhanced match={this.props.match} members={this.room.members} room_id={this.room._id} onFinished={() => console.log("Edit group")} />
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export const ChatRoomSettingsPage = connect(mapStateToProps)(ChatRoomSettings) as React.ComponentClass<{ match, onError }>;