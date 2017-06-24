import * as React from "react";
import { Flex } from "reflexbox";
import { RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { SigninBox } from "./SigninBox";
import { SignupBox } from "./SignupBox";
import * as AuthRx from "../../redux/authen/authRx";
export class AuthenBox extends React.Component {
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
        return (React.createElement(MuiThemeProvider, null,
            React.createElement(Flex, { flexColumn: true },
                (this.state.showSignin) ?
                    React.createElement(SigninBox, { dispatch: this.props.dispatch, onError: this.props.onError }) :
                    React.createElement(SignupBox, Object.assign({}, this.props, { onError: this.props.onError })),
                (this.state.showSignin) ?
                    (React.createElement(Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "New to chitchat?"),
                        React.createElement(RaisedButton, { primary: true, label: "Sign up now", onClick: this.onSignupPressed, style: { margin: 8 } }, " "))) :
                    (React.createElement(Flex, { justify: "center", align: "center", p: 2 },
                        React.createElement("p", null, "Already have account?"),
                        React.createElement(RaisedButton, { primary: true, label: "Sign in", onClick: this.onSigninPressed, style: { margin: 8 } }, " "))))));
    }
}
