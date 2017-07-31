import * as React from "react";
import Flexbox from "flexbox-react";
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
        return (<MuiThemeProvider>
                <Flexbox flexDirection="column">
                    {(this.state.showSignin) ?
            <SigninBox dispatch={this.props.dispatch} onError={this.props.onError}/> :
            <SignupBox {...this.props} onError={this.props.onError}/>}
                    {(this.state.showSignin) ?
            (<Flexbox justifyContent="center" alignItems="center">
                                <p>New to chitchat?</p>
                                <RaisedButton primary={true} label="Sign up now" onClick={this.onSignupPressed} style={{ margin: 8 }}> </RaisedButton>
                            </Flexbox>) :
            (<Flexbox justifyContent="center" alignItems="center">
                                <p>Already have account?</p>
                                <RaisedButton primary={true} label="Sign in" onClick={this.onSigninPressed} style={{ margin: 8 }}> </RaisedButton>
                            </Flexbox>)}
                </Flexbox>
            </MuiThemeProvider>);
    }
}
