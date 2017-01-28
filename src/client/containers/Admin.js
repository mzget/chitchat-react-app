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
const AdminBox_1 = require("./admins/AdminBox");
const CreateGroupBox_1 = require("./group/CreateGroupBox");
const DialogBox_1 = require("../components/DialogBox");
;
class Admin extends React.Component {
    constructor() {
        super(...arguments);
        this.alertTitle = "";
        this.alertMessage = "";
        this.menus = ["create-org-group", "create-projectbase-group", "create-group"];
    }
    componentWillMount() {
        this.state = {
            isCreateGroup: false,
            alert: false,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onAdminMenuSelected = this.onAdminMenuSelected.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }
    onAdminMenuSelected(key) {
        console.log('onAdminMenuSelected', key);
        if (key === this.menus[0]) {
            this.setState(previous => (__assign({}, previous, { isCreateGroup: true })));
        }
    }
    onBackPressed() {
        if (this.state.isCreateGroup) {
            this.setState(previous => (__assign({}, previous, { isCreateGroup: false })));
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
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement(SimpleToolbar_1.default, { title: 'Admin', onBackPressed: this.onBackPressed }),
                (!this.state.isCreateGroup) ?
                    React.createElement(AdminBox_1.default, { itemName: this.menus, onSelectItem: this.onAdminMenuSelected })
                    :
                        React.createElement(CreateGroupBox_1.default, __assign({}, this.props, { onError: this.onAlert })),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert }))));
    }
}
const mapstateToProps = (state) => {
    return __assign({}, state);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapstateToProps)(Admin);
