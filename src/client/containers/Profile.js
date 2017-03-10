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
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const Subheader_1 = require("material-ui/Subheader");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
;
class Profile extends React.Component {
    constructor() {
        super(...arguments);
        this.alertTitle = "";
        this.alertMessage = "";
    }
    componentWillMount() {
        this.state = {
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (__assign({}, prevState, { alert: false })), () => {
            // @Here clear error message in reducer.
        });
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement("div", null,
                React.createElement("div", { id: "toolbar", style: { height: this.headerHeight } },
                    React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed }),
                    React.createElement(Subheader_1.default, null, null)),
                React.createElement("div", { style: { backgroundColor: Colors.indigo50 } },
                    React.createElement("div", { id: "app_body", style: { height: this.bodyHeight, backgroundColor: Colors.indigo50 } },
                        React.createElement(reflexbox_1.Flex, { flexColumn: true },
                            React.createElement(reflexbox_1.Flex, { align: "center" },
                                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                            React.createElement(reflexbox_1.Box, { flexAuto: true, justify: "flex-end" }),
                            React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert })))))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Profile);
