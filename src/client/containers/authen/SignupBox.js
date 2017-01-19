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
const SignupForm_1 = require("../../components/SignupForm");
const CryptoHelper = require("../../chats/utils/CryptoHelper");
const ValidateUtils = require("../../utils/ValidationUtils");
const AuthRx = require("../../redux/authen/authRx");
;
;
class SignupBox extends React.Component {
    componentWillMount() {
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: ''
        };
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    onSubmitForm() {
        console.log("submit form", this.state);
        if (this.state.password != this.state.confirmPassword) {
            console.error('confirm password is not match!');
        }
        else if (this.state.email.length > 0 && this.state.password.length > 0) {
            ValidateUtils.validateEmailPass(this.state.email, this.state.password, (result) => {
                if (!result) {
                    if (this.state.firstname.length > 0 && this.state.lastname.length > 0) {
                        CryptoHelper.hashComputation(this.state.password).then((hash) => {
                            this.setState(previous => (__assign({}, previous, { password: hash, confirmPassword: null })), () => {
                                this.props.dispatch(AuthRx.signup(this.state));
                            });
                        });
                    }
                    else {
                        console.error('The require fields is missing!');
                    }
                }
                else {
                    console.warn(JSON.stringify(result));
                }
            });
        }
    }
    render() {
        return (React.createElement("span", null,
            React.createElement(SignupForm_1.SignupForm, { email: this.state.email, onEmailChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { email: text })));
                }, password: this.state.password, onPasswordChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { password: text })));
                }, confirmPassword: this.state.confirmPassword, onConfirmPasswordChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { confirmPassword: text })));
                }, firstname: this.state.firstname, onFirstnameChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { firstname: text })));
                }, lastname: this.state.lastname, onLastnameChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { lastname: text })));
                }, onSubmit: this.onSubmitForm })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignupBox;
