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
/**
 * Redux + Immutable
 */
const immutable = require("immutable");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const Colors = require("material-ui/styles/colors");
const AuthRx = require("../redux/authen/authRx");
const AppActions = require("../redux/app/persistentDataActions");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const AuthenBox_1 = require("./authen/AuthenBox");
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.alertMessage = "";
        this.alertTitle = "";
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = 56;
        this.subHeaderHeight = null;
        this.bodyHeight = null;
        this.footerHeight = 24;
        console.log("Home", global.userAgent);
        this.state = {
            alert: false
        };
        this.closeAlert = this.closeAlert.bind(this);
        this.onAuthBoxError = this.onAuthBoxError.bind(this);
        this.props.dispatch(AppActions.getSession());
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
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer } = nextProps;
        let toolbar = document.getElementById("toolbar");
        let warning_bar = document.getElementById("warning_bar");
        let app_body = document.getElementById("app_body");
        let app_footer = document.getElementById("app_footer");
        this.subHeaderHeight = (warning_bar) ? warning_bar.clientHeight : 0;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight));
        let next = immutable.fromJS(authReducer);
        let prev = immutable.fromJS(this.props.authReducer);
        if (next && !next.equals(prev)) {
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
                case AuthRx.SIGN_UP_FAILURE: {
                    this.onAuthBoxError(authReducer.error);
                    break;
                }
                default:
                    break;
            }
        }
    }
    render() {
        let { location: { query: { userId, username, roomId, contactId } } } = this.props;
        return (React.createElement("div", { style: { overflow: "hidden" } },
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "ChitChat team communication." })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, height: this.bodyHeight } },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement(reflexbox_1.Flex, { align: "center" },
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                        React.createElement(AuthenBox_1.AuthenBox, __assign({}, this.props, { onError: this.onAuthBoxError })),
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                    React.createElement(reflexbox_1.Box, { flexAuto: true, justify: "flex-end" }),
                    React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert }))),
            React.createElement("div", { id: "app_footer", style: {
                    width: this.clientWidth, height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                } },
                React.createElement(reflexbox_1.Flex, { px: 2, align: "center", justify: "center" },
                    React.createElement("span", null, "Powered by Stalk realtime messaging service.")))));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Home);
