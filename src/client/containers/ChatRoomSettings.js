"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const MenuListView_1 = require("../components/MenuListView");
const EditGroupMember_1 = require("./roomSettings/EditGroupMember");
const GroupDetail_1 = require("./roomSettings/GroupDetail");
const chatroomActions = require("../redux/chatroom/chatroomActions");
const EDIT_GROUP = "EDIT_GROUP";
const GROUP_MEMBERS = "GROUP_MEMBERS";
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isEditGroup"] = 1] = "isEditGroup";
    BoxState[BoxState["isEditMember"] = 2] = "isEditMember";
})(BoxState || (BoxState = {}));
;
class ChatRoomSettings extends React.Component {
    constructor() {
        super(...arguments);
        this.title = "Room settings";
        this.alertTitle = "Alert!";
        this.alertMessage = "";
        this.menus = [EDIT_GROUP, GROUP_MEMBERS];
    }
    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onMenuSelected = this.onMenuSelected.bind(this);
        this.getViewPanel = this.getViewPanel.bind(this);
    }
    componentDidMount() {
        let { params } = this.props;
        this.props.dispatch(chatroomActions.getPersistendChatroom(params.room_id));
    }
    componentWillReceiveProps(nextProps) {
    }
    componentWillUpdate(nextProps, nextState) {
    }
    componentDidUpdate(prevProps, prevState) {
    }
    componentWillUnmount() {
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SimpleToolbar_1.default, { title: this.title, onBackPressed: this.onBackPressed }),
            React.createElement(MenuListView_1.MenuListview, { title: this.title, menus: this.menus, onSelectItem: this.onMenuSelected }),
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
        this.setState(prevState => (Object.assign({}, prevState)), () => {
            // this.props.dispatch(groupRx.emptyState());
            // this.props.dispatch(adminRx.emptyState());
        });
    }
    onMenuSelected(key) {
        console.log("onMenuSelected", key);
        if (key == GROUP_MEMBERS) {
            this.setState(prevState => (Object.assign({}, prevState, { boxState: BoxState.isEditMember })));
        }
        else if (key == EDIT_GROUP) {
            this.setState(prevState => (Object.assign({}, prevState, { boxState: BoxState.isEditGroup })));
        }
    }
    getViewPanel() {
        let { params, teamReducer, chatroomReducer } = this.props;
        let { room } = chatroomReducer;
        switch (this.state.boxState) {
            case BoxState.isEditMember:
                return React.createElement(EditGroupMember_1.ConnectEditGroupMember, { teamMembers: teamReducer.members, room_id: params.room_id, initMembers: room.members, onFinished: () => this.setState(prev => (Object.assign({}, prev, { boxState: BoxState.idle }))) });
            case BoxState.isEditGroup:
                return React.createElement(GroupDetail_1.ConnectGroupDetail, { image: room.image, group_name: room.name, group_description: room.description });
            default:
                return null;
        }
    }
}
const mapStateToProps = (state) => (Object.assign({}, state));
exports.default = react_redux_1.connect(mapStateToProps)(ChatRoomSettings);
