"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SampleLoginBox_1 = require("./SampleLoginBox");
const SignupBox_1 = require("./SignupBox");
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
                    React.createElement(SampleLoginBox_1.default, null) : React.createElement(SignupBox_1.default, null),
                (this.state.showSignin) ?
                    (React.createElement(reflexbox_1.Flex, { justify: 'center', align: 'center', p: 2 },
                        React.createElement("p", null, "New to chitchat?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign up now", onClick: this.onSignupPressed, style: { margin: 8 } }, " "))) :
                    (React.createElement(reflexbox_1.Flex, { justify: 'center', align: 'center', p: 2 },
                        React.createElement("p", null, "Already have account?"),
                        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign in", onClick: this.onSigninPressed, style: { margin: 8 } }, " "))))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthenBox;
