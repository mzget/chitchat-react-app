"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const MenuListView_1 = require("../components/MenuListView");
const EditGroupMember_1 = require("./roomSettings/EditGroupMember");
const GroupDetailEnhancer_1 = require("./roomSettings/GroupDetailEnhancer");
const GroupMemberEnhancer_1 = require("./roomSettings/GroupMemberEnhancer");
const chatroomActions = require("../chats/redux/chatroom/chatroomActions");
const groupRx = require("../redux/group/groupRx");
const Room_1 = require("../libs/shared/Room");
const EDIT_GROUP = "EDIT_GROUP";
const EDIT_GROUP_MEMBERS = "EDIT_GROUP_MEMBERS";
const GROUP_MEMBERS = "GROUP_MEMBERS";
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isEditGroup"] = 1] = "isEditGroup";
    BoxState[BoxState["isEditMember"] = 2] = "isEditMember";
    BoxState[BoxState["viewMembers"] = 3] = "viewMembers";
})(BoxState || (BoxState = {}));
;
class ChatRoomSettings extends React.Component {
    constructor() {
        super(...arguments);
        this.title = "Room settings";
        this.alertTitle = "Alert!";
        this.alertMessage = "";
        this.menus = [EDIT_GROUP, EDIT_GROUP_MEMBERS, GROUP_MEMBERS];
    }
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
        let { room } = chatroomReducer;
        return (React.createElement("div", null,
            React.createElement(SimpleToolbar_1.SimpleToolbar, { title: this.title, onBackPressed: this.onBackPressed }),
            React.createElement(MenuListView_1.MenuListview, { title: (room) ? room.name : "Settings", menus: this.menus, onSelectItem: this.onMenuSelected }),
            this.getViewPanel(),
            React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert })));
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (__assign({}, prevState, { alert: false })), () => {
            this.props.dispatch(groupRx.emptyState());
            // this.props.dispatch(adminRx.emptyState());
        });
    }
    onAlert(error) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => (__assign({}, previous, { alert: true })));
    }
    onMenuSelected(key) {
        console.log("onMenuSelected", key);
        let { chatroomReducer } = this.props;
        let { room } = chatroomReducer;
        // @Todo ...
        // Check room type and user permision for edit group details.
        if (key == EDIT_GROUP_MEMBERS) {
            if (room.type == Room_1.RoomType.privateGroup) {
                this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.isEditMember })));
            }
            else {
                this.onAlert("Request for valid group permission!");
            }
        }
        else if (key == EDIT_GROUP) {
            if (room.type == Room_1.RoomType.privateGroup) {
                this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.isEditGroup })));
            }
            else {
                this.onAlert("Request for valid group permission!");
            }
        }
        else if (key == GROUP_MEMBERS) {
            this.setState(prevState => (__assign({}, prevState, { boxState: BoxState.viewMembers })));
        }
    }
    getViewPanel() {
        let { params, teamReducer, chatroomReducer } = this.props;
        let { room } = chatroomReducer;
        switch (this.state.boxState) {
            case BoxState.isEditMember:
                return React.createElement(EditGroupMember_1.ConnectEditGroupMember, { teamMembers: teamReducer.members, room_id: params.room_id, initMembers: room.members, onFinished: () => this.setState(prev => (__assign({}, prev, { boxState: BoxState.idle }))) });
            case BoxState.isEditGroup:
                return React.createElement(GroupDetailEnhancer_1.ConnectGroupDetail, { group: room, image: room.image, group_name: room.name, group_description: room.description, onError: (message) => this.onAlert(message), onFinished: () => this.setState(prev => (__assign({}, prev, { boxState: BoxState.idle }))) });
            case BoxState.viewMembers:
                return React.createElement(GroupMemberEnhancer_1.GroupMemberEnhancer, { members: room.members });
            default:
                return null;
        }
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(ChatRoomSettings);
