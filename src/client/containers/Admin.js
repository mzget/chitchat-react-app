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
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const AdminMenu_1 = require("./admins/AdminMenu");
const ManageOrgChartBox_1 = require("./admins/ManageOrgChartBox");
const CreateGroupBox_1 = require("./admins/CreateGroupBox");
const DialogBox_1 = require("../components/DialogBox");
var BoxState;
(function (BoxState) {
    BoxState[BoxState["idle"] = 0] = "idle";
    BoxState[BoxState["isCreateGroup"] = 1] = "isCreateGroup";
    BoxState[BoxState["isManageTeam"] = 2] = "isManageTeam";
})(BoxState || (BoxState = {}));
;
;
class Admin extends React.Component {
    constructor() {
        super(...arguments);
        this.alertTitle = "";
        this.alertMessage = "";
        this.manageOrgChart = "Manage ORG Chart";
        this.createOrgGroup = "create-org-group";
        this.createPjbGroup = "create-projectbase-group";
        this.createPvGroup = "create-group";
        this.menus = [this.manageOrgChart, this.createOrgGroup, this.createPjbGroup, this.createPvGroup];
    }
    componentWillMount() {
        this.state = {
            boxState: BoxState.idle,
            alert: false,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }
    onAdminMenuSelected(key) {
        console.log('onAdminMenuSelected', key);
        if (key === this.createOrgGroup || key === this.createPjbGroup || key === this.createPvGroup) {
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.isCreateGroup })));
        }
        else if (key === this.manageOrgChart) {
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.isManageTeam })));
        }
    }
    onBackPressed() {
        if (this.state.boxState) {
            this.setState(previous => (__assign({}, previous, { boxState: BoxState.idle })));
        }
        else {
            // Jump to main menu.
            this.props.router.goBack();
        }
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (__assign({}, prevState, { alert: false })));
    }
    onAlert(error) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => (__assign({}, previous, { alert: true })));
    }
    getAdminPanel() {
        switch (this.state.boxState) {
            case BoxState.isManageTeam:
                return React.createElement(ManageOrgChartBox_1.default, __assign({}, this.props, { onError: this.onAlert }));
            case BoxState.isCreateGroup:
                return React.createElement(CreateGroupBox_1.default, __assign({}, this.props, { onError: this.onAlert }));
            default:
                return React.createElement(AdminMenu_1.AdminMenu, { itemName: this.menus, onSelectItem: this.onAdminMenuSelected });
        }
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(SimpleToolbar_1.default, { title: 'Admin', onBackPressed: this.onBackPressed }),
                this.getAdminPanel(),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert }))));
    }
}
const mapstateToProps = (state) => {
    return __assign({}, state);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapstateToProps)(Admin);
