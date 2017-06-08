"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var reflexbox_1 = require("reflexbox");
var Colors = require("material-ui/styles/colors");
var AuthRx = require("../redux/authen/authRx");
var AppActions = require("../redux/app/persistentDataActions");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var AuthenBox_1 = require("./authen/AuthenBox");
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clientWidth = document.documentElement.clientWidth;
        _this.clientHeight = document.documentElement.clientHeight;
        _this.headerHeight = 56;
        _this.subHeaderHeight = null;
        _this.bodyHeight = null;
        _this.footerHeight = 24;
        return _this;
    }
    Home.prototype.onForgotAccount = function () {
        this.props.history.push("/forgotaccount");
    };
    Home.prototype.componentWillMount = function () {
        console.log("Home", global.userAgent, this.props);
        this.state = {
            alert: false
        };
        this.headerHeight = 56;
        this.footerHeight = 24;
        this.clientHeight = document.documentElement.clientHeight;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight));
        this.props.dispatch(AppActions.getSession());
        this.onForgotAccount = this.onForgotAccount.bind(this);
    };
    Home.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = nextProps, userReducer = _a.userReducer, authReducer = _a.authReducer, alertReducer = _a.alertReducer;
        var toolbar = document.getElementById("toolbar");
        var warning_bar = document.getElementById("warning_bar");
        var app_body = document.getElementById("app_body");
        var app_footer = document.getElementById("app_footer");
        this.subHeaderHeight = (warning_bar) ? warning_bar.clientHeight : 0;
        if (!recompose_1.shallowEqual(authReducer, this.props.authReducer)) {
            switch (authReducer.state) {
                case AuthRx.AUTH_USER_SUCCESS: {
                    AppActions.saveSession();
                    break;
                }
                case AuthRx.AUTH_USER_FAILURE: {
                    this.alertTitle = AuthRx.AUTH_USER_FAILURE;
                    this.alertMessage = authReducer.error;
                    this.setState(function (previous) { return (__assign({}, previous, { alert: true })); });
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
        if (!recompose_1.shallowEqual(userReducer.user, this.props.userReducer.user)) {
            if (userReducer.user) {
                this.props.history.replace("/team/" + authReducer.user);
            }
        }
        if (alertReducer.error) {
            this.props.onError(alertReducer.error);
        }
    };
    Home.prototype.render = function () {
        return (React.createElement("div", { style: { overflow: "hidden" } },
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "ChitChat team communication." })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, height: this.bodyHeight } },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement(reflexbox_1.Flex, { align: "center" },
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                        React.createElement(AuthenBox_1.AuthenBox, __assign({}, this.props, { onError: this.props.onError })),
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                    React.createElement(reflexbox_1.Flex, { align: "center" },
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                        React.createElement("button", { onClick: this.onForgotAccount },
                            React.createElement("b", null, "Forgotten account.")),
                        React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
                    React.createElement(reflexbox_1.Box, { flexAuto: true, justify: "flex-end" }))),
            React.createElement("div", { id: "app_footer", style: {
                    width: this.clientWidth, height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                } },
                React.createElement(reflexbox_1.Flex, { px: 2, align: "center", justify: "center" },
                    React.createElement("span", null, "Powered by Stalk realtime communication API.")))));
    };
    return Home;
}(React.Component));
/**
 * ## Redux boilerplate
 */
var mapStateToProps = function (state) { return (__assign({}, state)); };
exports.HomeWithState = react_redux_1.connect(mapStateToProps)(Home);
