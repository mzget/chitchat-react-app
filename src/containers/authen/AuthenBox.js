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
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var SigninBox_1 = require("./SigninBox");
var SignupBox_1 = require("./SignupBox");
var AuthRx = require("../../redux/authen/authRx");
var AuthenBox = (function (_super) {
    __extends(AuthenBox, _super);
    function AuthenBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthenBox.prototype.componentWillMount = function () {
        this.state = {
            showSignin: true
        };
        this.onSignupPressed = this.onSignupPressed.bind(this);
        this.onSigninPressed = this.onSigninPressed.bind(this);
    };
    AuthenBox.prototype.componentWillReceiveProps = function (nextProps) {
        var authReducer = nextProps.authReducer;
        if (authReducer.state === AuthRx.SIGN_UP_SUCCESS) {
            this.setState({ showSignin: true });
        }
    };
    AuthenBox.prototype.onSignupPressed = function () {
        this.setState({ showSignin: false });
    };
    AuthenBox.prototype.onSigninPressed = function () {
        this.setState({ showSignin: true });
    };
    AuthenBox.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement(reflexbox_1.Flex, { flexColumn: true },
                (this.state.showSignin) ?
                    React.createElement(SigninBox_1.SigninBox, { dispatch: this.props.dispatch, onError: this.props.onError }) :
                    React.createElement(SignupBox_1.SignupBox, __assign({}, this.props, { onError: this.props.onError })),
                (this.state.showSignin) ?
                    (React.createElement(reflexbox_1.Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "New to chitchat?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign up now", onClick: this.onSignupPressed, style: { margin: 8 } }, " "))) :
                    (React.createElement(reflexbox_1.Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "Already have account?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign in", onClick: this.onSigninPressed, style: { margin: 8 } }, " "))))));
    };
    return AuthenBox;
}(React.Component));
exports.AuthenBox = AuthenBox;
