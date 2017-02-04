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
const AuthRx = require("../redux/authen/authRx");
const AppActions = require("../redux/app/persistentDataActions");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const AuthenBox_1 = require("./authen/AuthenBox");
;
class Home extends React.Component {
    constructor() {
        super(...arguments);
        this.alertMessage = "";
        this.alertTitle = "";
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (__assign({}, prevState, { alert: false })), () => this.props.dispatch(AuthRx.clearError()));
    }
    onAuthBoxError(error) {
        this.alertTitle = "Authentication!";
        this.alertMessage = error;
        this.setState(prevState => (__assign({}, prevState, { alert: true })));
    }
    componentWillMount() {
        console.log("Home", global.userAgent);
        this.state = {
            alert: false
        };
        this.closeAlert = this.closeAlert.bind(this);
        this.onAuthBoxError = this.onAuthBoxError.bind(this);
        this.props.dispatch(AppActions.getSession());
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer } = nextProps;
        switch (authReducer.state) {
            case AuthRx.AUTH_USER_SUCCESS: {
                AppActions.saveSession();
                this.props.router.push(`/team/${authReducer.user}`);
                break;
            }
            case AuthRx.AUTH_USER_FAILURE: {
                this.alertTitle = AuthRx.AUTH_USER_FAILURE;
                this.alertMessage = authReducer.error;
                this.setState(previous => (__assign({}, previous, { alert: true })));
                break;
            }
            case AuthRx.TOKEN_AUTH_USER_SUCCESS: {
                this.props.router.push(`/team/${authReducer.user}`);
                break;
            }
            case AppActions.GET_SESSION_TOKEN_SUCCESS: {
                if (authReducer.state !== this.props.authReducer.state)
                    this.props.dispatch(AuthRx.tokenAuthUser(authReducer.token));
                break;
            }
            default:
                break;
        }
    }
    render() {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, userReducer } = this.props;
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true },
                React.createElement("div", null,
                    React.createElement(SimpleToolbar_1.default, { title: "ChitChat team communication." }),
                    React.createElement(Subheader_1.default, null, null)),
                React.createElement(reflexbox_1.Flex, { align: "center" },
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                    React.createElement(AuthenBox_1.default, __assign({}, this.props, { onError: this.onAuthBoxError })),
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                React.createElement(reflexbox_1.Flex, { px: 2, align: "center" },
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                    React.createElement("p", null, "Stalk realtime messaging service."),
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert }))));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Home);
