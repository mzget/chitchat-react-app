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
var SignupForm_1 = require("../../components/SignupForm");
var CryptoHelper = require("../../chitchat/chats/utils/CryptoHelper");
var ValidateUtils = require("../../utils/ValidationUtils");
var AuthRx = require("../../redux/authen/authRx");
var SignupBox = (function (_super) {
    __extends(SignupBox, _super);
    function SignupBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignupBox.prototype.componentWillMount = function () {
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: ""
        };
        this.onSubmitForm = this.onSubmitForm.bind(this);
    };
    SignupBox.prototype.onSubmitForm = function () {
        var _this = this;
        if (this.state.password !== this.state.confirmPassword) {
            this.props.onError("confirm password is not match!");
        }
        else if (this.state.email.length > 0 && this.state.password.length > 0) {
            ValidateUtils.validateEmailPass(this.state.email, this.state.password, function (result) {
                if (!result) {
                    if (_this.state.firstname.length > 0 && _this.state.lastname.length > 0) {
                        CryptoHelper.hashComputation(_this.state.password).then(function (hash) {
                            _this.setState(function (previous) { return (__assign({}, previous, { password: hash, confirmPassword: "" })); }, function () {
                                _this.props.dispatch(AuthRx.signup(_this.state));
                            });
                        });
                    }
                    else {
                        _this.props.onError("The require fields is missing!");
                    }
                }
                else {
                    console.warn(JSON.stringify(result));
                }
            });
        }
        else {
            this.props.onError("The require fields is missing!");
        }
    };
    SignupBox.prototype.render = function () {
        var _this = this;
        return (React.createElement("span", null,
            React.createElement(SignupForm_1.SignupForm, { email: this.state.email, onEmailChange: function (e, text) {
                    _this.setState(function (previous) { return (__assign({}, previous, { email: text })); });
                }, password: this.state.password, onPasswordChange: function (e, text) {
                    _this.setState(function (previous) { return (__assign({}, previous, { password: text })); });
                }, confirmPassword: this.state.confirmPassword, onConfirmPasswordChange: function (e, text) {
                    _this.setState(function (previous) { return (__assign({}, previous, { confirmPassword: text })); });
                }, firstname: this.state.firstname, onFirstnameChange: function (e, text) {
                    _this.setState(function (previous) { return (__assign({}, previous, { firstname: text })); });
                }, lastname: this.state.lastname, onLastnameChange: function (e, text) {
                    _this.setState(function (previous) { return (__assign({}, previous, { lastname: text })); });
                }, onSubmit: this.onSubmitForm })));
    };
    return SignupBox;
}(React.Component));
exports.SignupBox = SignupBox;
