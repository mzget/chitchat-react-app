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
const SignupForm_1 = require("./SignupForm");
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
