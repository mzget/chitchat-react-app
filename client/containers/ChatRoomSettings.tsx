import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../utils/IComponentProps";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { MenuListview } from "../components/MenuListView";
import { ConnectEditGroupMember } from "./roomSettings/EditGroupMember";
import { ConnectGroupDetail } from "./roomSettings/GroupDetailEnhancer";
import { GroupMemberEnhancer } from "./roomSettings/GroupMemberEnhancer";

import * as chatroomActions from "../chitchat/chats/redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { Room, RoomType } from "../chitchat/libs/shared/Room";

const EDIT_GROUP = "EDIT_GROUP";
const EDIT_GROUP_MEMBERS = "EDIT_GROUP_MEMBERS";
const GROUP_MEMBERS = "GROUP_MEMBERS";
enum BoxState {
    idle = 0, isEditGroup = 1, isEditMember, viewMembers
};
interface IComponentState {
    boxState: BoxState;
    alert: boolean;
}
class ChatRoomSettings extends React.Component<IComponentProps, IComponentState> {
    title = "Room settings";
    alertTitle = "Alert!";
    alertMessage = "";
    menus = [EDIT_GROUP, EDIT_GROUP_MEMBERS, GROUP_MEMBERS];

    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onMenuSelected = this.onMenuSelected.bind(this);
        this.getViewPanel = this.getViewPanel.bind(this);
    }

    componentDidMount() {
        let { params } = this.props;
        this.props.dispatch(chatroomActions.getPersistendChatroom(params.room_id));
    }

    render() {
        let { chatroomReducer } = this.props;
        let { room }: { room: Room } = chatroomReducer;

        return (
            <div>
                <SimpleToolbar title={this.title} onBackPressed={this.onBackPressed} />
                <MenuListview title={(room) ? room.name : "Settings"} menus={this.menus} onSelectItem={this.onMenuSelected} />
                {
                    this.getViewPanel()
                }
                <DialogBox
                    title={this.alertTitle}
                    message={this.alertMessage}
                    open={this.state.alert}
                    handleClose={this.closeAlert} />
            </div>
        );
    }

    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () => {
            this.props.dispatch(groupRx.emptyState());
            // this.props.dispatch(adminRx.emptyState());
        });
    }
    onAlert(error: string) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => ({ ...previous, alert: true }));
    }
    onMenuSelected(key: string) {
        console.log("onMenuSelected", key);

        let { chatroomReducer } = this.props;
        let { room }: { room: Room } = chatroomReducer;
        // @Todo ...
        // Check room type and user permision for edit group details.
        if (key == EDIT_GROUP_MEMBERS) {
            if (room.type == RoomType.privateGroup) {
                this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditMember }));
            }
            else {
                this.onAlert("Request for valid group permission!");
            }
        }
        else if (key == EDIT_GROUP) {
            if (room.type == RoomType.privateGroup) {
                this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditGroup }));
            }
            else {
                this.onAlert("Request for valid group permission!");
            }
        }
        else if (key == GROUP_MEMBERS) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.viewMembers }));
        }
    }

    getViewPanel() {
        let { params, teamReducer, chatroomReducer } = this.props;
        let { room }: { room: Room } = chatroomReducer;

        switch (this.state.boxState) {
            case BoxState.isEditMember:
                return <ConnectEditGroupMember
                    teamMembers={teamReducer.members}
                    room_id={params.room_id}
                    initMembers={room.members}
                    onFinished={() => this.setState(prev => ({ ...prev, boxState: BoxState.idle }))} />;
            case BoxState.isEditGroup:
                return <ConnectGroupDetail
                    group={room}
                    image={room.image}
                    group_name={room.name}
                    group_description={room.description}
                    onError={(message) => this.onAlert(message)}
                    onFinished={() => this.setState(prev => ({ ...prev, boxState: BoxState.idle }))} />;
            case BoxState.viewMembers:
                return <GroupMemberEnhancer members={room.members} />;
            default:
                return null;
        }
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(ChatRoomSettings);