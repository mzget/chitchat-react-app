"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const SigninForm_1 = require("../../components/SigninForm");
const CryptoHelper = require("../../chats/utils/CryptoHelper");
const AuthRx = require("../../redux/authen/authRx");
;
;
class SigninBox extends React.Component {
    componentWillMount() {
        this.state = {
            username: "",
            password: ""
        };
        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    onUsername(event, text) {
        this.setState(previous => (Object.assign({}, previous, { username: text })));
    }
    onPassword(event, text) {
        this.setState(previous => (Object.assign({}, previous, { password: text })));
    }
    onSubmitForm() {
        let username = this.state.username;
        let password = this.state.password;
        this.setState({ username: "", password: "" });
        if (username.length > 0 && password.length > 0) {
            CryptoHelper.hashComputation(password).then((hash) => {
                this.props.dispatch(AuthRx.authUser({ email: username, password: hash }));
            });
        }
        else {
            console.error("Require fields is missing!");
            this.props.onError("Require fields is missing!");
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SigninForm_1.SigninForm, { username: this.state.username, onUsername: this.onUsername, password: this.state.password, onPassword: this.onPassword, onSubmit: this.onSubmitForm })));
    }
}
exports.default = SigninBox;
