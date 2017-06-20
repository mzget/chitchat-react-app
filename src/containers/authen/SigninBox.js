"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var SigninForm_1 = require("../../components/SigninForm");
var CryptoHelper = require("../../chitchat/chats/utils/CryptoHelper");
var AuthRx = require("../../redux/authen/authRx");
;
;
var SigninBox = (function (_super) {
    __extends(SigninBox, _super);
    function SigninBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SigninBox.prototype.componentWillMount = function () {
        this.state = {
            username: "",
            password: ""
        };
        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    };
    SigninBox.prototype.onUsername = function (event, text) {
        this.setState(function (previous) { return (__assign({}, previous, { username: text })); });
    };
    SigninBox.prototype.onPassword = function (event, text) {
        this.setState(function (previous) { return (__assign({}, previous, { password: text })); });
    };
    SigninBox.prototype.onSubmitForm = function () {
        var _this = this;
        var username = this.state.username;
        var password = this.state.password;
        this.setState({ username: "", password: "" });
        if (username.length > 0 && password.length > 0) {
            CryptoHelper.hashComputation(password).then(function (hash) {
                _this.props.dispatch(AuthRx.authUser({ email: username, password: hash }));
            });
        }
        else {
            console.error("Require fields is missing!");
            this.props.onError("Require fields is missing!");
        }
    };
    SigninBox.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(SigninForm_1.SigninForm, { username: this.state.username, onUsername: this.onUsername, password: this.state.password, onPassword: this.onPassword, onSubmit: this.onSubmitForm })));
    };
    return SigninBox;
}(React.Component));
exports.SigninBox = SigninBox;
