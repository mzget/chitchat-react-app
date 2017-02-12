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
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SigninBox_1 = require("./SigninBox");
const SignupBox_1 = require("./SignupBox");
const AuthRx = require("../../redux/authen/authRx");
;
;
class AuthenBox extends React.Component {
    componentWillMount() {
        this.state = {
            showSignin: true
        };
        this.onSignupPressed = this.onSignupPressed.bind(this);
        this.onSigninPressed = this.onSigninPressed.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { authReducer } = nextProps;
        if (authReducer.state === AuthRx.SIGN_UP_SUCCESS) {
            this.setState({ showSignin: true });
        }
    }
    onSignupPressed() {
        this.setState({ showSignin: false });
    }
    onSigninPressed() {
        this.setState({ showSignin: true });
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(reflexbox_1.Flex, { flexColumn: true },
                (this.state.showSignin) ?
                    React.createElement(SigninBox_1.default, { dispatch: this.props.dispatch, onError: this.props.onError }) : React.createElement(SignupBox_1.default, __assign({}, this.props, { onError: this.props.onError })),
                (this.state.showSignin) ?
                    (React.createElement(reflexbox_1.Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "New to chitchat?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign up now", onClick: this.onSignupPressed, style: { margin: 8 } }, " "))) :
                    (React.createElement(reflexbox_1.Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "Already have account?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign in", onClick: this.onSigninPressed, style: { margin: 8 } }, " "))))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthenBox;
