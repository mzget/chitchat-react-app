import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../utils/IComponentProps";

import SimpleToolbar from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { MenuListview } from "../components/MenuListView";
import { ConnectEditGroupMember } from "./roomSettings/EditGroupMember";
import { ConnectGroupDetail } from "./roomSettings/GroupDetail";

import * as chatroomActions from "../redux/chatroom/chatroomActions";
import * as groupRx from "../redux/group/groupRx";

import { Room } from "../../server/scripts/models/Room";

const EDIT_GROUP = "EDIT_GROUP";
const GROUP_MEMBERS = "GROUP_MEMBERS";
enum BoxState {
    idle = 0, isEditGroup = 1, isEditMember
};
interface IComponentState {
    boxState: BoxState;
    alert: boolean;
}
class ChatRoomSettings extends React.Component<IComponentProps, IComponentState> {
    title = "Room settings";
    alertTitle = "Alert!";
    alertMessage = "";
    menus = [EDIT_GROUP, GROUP_MEMBERS];

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
        return (
            <div>
                <SimpleToolbar title={this.title} onBackPressed={this.onBackPressed} />
                <MenuListview title={this.title} menus={this.menus} onSelectItem={this.onMenuSelected} />
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
        if (key == GROUP_MEMBERS) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditMember }));
        }
        else if (key == EDIT_GROUP) {
            this.setState(prevState => ({ ...prevState, boxState: BoxState.isEditGroup }));
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
            default:
                return null;
        }
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(ChatRoomSettings);