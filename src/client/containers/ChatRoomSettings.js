"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const MenuListView_1 = require("../components/MenuListView");
const EDIT_GROUP = "EDIT_GROUP";
const GROUP_MEMBERS = "GROUP_MEMBERS";
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
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    shouldComponentUpdate(nextProps, nextState) {
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
            React.createElement(MenuListView_1.MenuListview, { title: this.title, menus: this.menus, onSelectItem: this.onAdminMenuSelected }),
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
    onAdminMenuSelected(key) {
        console.log("onAdminMenuSelected", key);
    }
    getAdminPanel() {
        switch (this.state.boxState) {
            default:
                return React.createElement(MenuListView_1.MenuListview, { menus: this.menus, onSelectItem: this.onAdminMenuSelected });
        }
    }
}
exports.default = ChatRoomSettings;
