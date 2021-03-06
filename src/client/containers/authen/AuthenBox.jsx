import * as React from "react";
import Flexbox from "flexbox-react";
import { shallowEqual } from "recompose";
import { RaisedButton } from "material-ui";
import * as Colors from "material-ui/styles/colors";
import { SigninBox } from "./SigninBox";
import { SignupBox } from "./SignupBox";
import { Facebook } from "../../components/social_login/SocialButtons";
import * as AuthRx from "../../redux/authen/authRx";
import * as CryptoHelper from "../../chitchat/chats/utils/CryptoHelper";
export class AuthenBox extends React.Component {
    componentWillMount() {
        this.state = {
            showSignin: true,
            social: {
                email: "",
                username: "",
                firstname: "",
                lastname: "",
                social_id: "",
                social_token: "",
                social_type: "",
                avatar: ""
            }
        };
        this.onSignupPressed = this.onSignupPressed.bind(this);
        this.onSigninPressed = this.onSigninPressed.bind(this);
        this.onSigning = this.onSigning.bind(this);
        this.onLogingIn = this.onLogingIn.bind(this);
        this.onFacebookLogin = this.onFacebookLogin.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { authReducer, alertReducer } = nextProps;
        if (authReducer.state === AuthRx.SIGN_UP_SUCCESS) {
            this.setState({ showSignin: true });
        }
        else if (authReducer.state === AuthRx.AUTH_SOCIAL_FAILURE && !shallowEqual(authReducer.state, this.props.authReducer.state)) {
            this.props.onError(alertReducer.error);
            this.props.dispatch(AuthRx.signupSocial(this.state.social));
        }
    }
    onSignupPressed() {
        this.setState({ showSignin: false });
    }
    onSigninPressed() {
        this.setState({ showSignin: true });
    }
    onSigning() {
        this.props.dispatch(AuthRx.authFetching());
    }
    onFacebookLogin(response) {
        console.log("onFacebookLogin", response);
        this.setState(prev => (Object.assign({}, prev, { social: {
                email: response.email,
                username: response.name,
                firstname: response.first_name,
                lastname: response.last_name,
                social_id: response.id,
                avatar: response.picture.data.url,
                social_type: "facebook"
            } })));
        let data = { email: response.email, social_type: "facebook" };
        this.props.dispatch(AuthRx.authSocial(data));
    }
    onLogingIn(username, password) {
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
        return (<Flexbox flexDirection="column" maxWidth="400px">
                {(this.state.showSignin) ?
            <SigninBox onLogingIn={this.onLogingIn}/> :
            <SignupBox {...this.props} onError={this.props.onError}/>}
                <span style={{ padding: 5 }}/>
                {(this.state.showSignin) ?
            <Flexbox justifyContent="center">
                            <Facebook onSocialLogin={this.onFacebookLogin} onClicked={this.onSigning} label="Login with Facebook"/>
                        </Flexbox>
            :
                null}
                <br />
                {(this.state.showSignin) ?
            (<Flexbox justifyContent="center" alignItems="center">
                            <p style={{ fontFamily: "Roboto", fontSize: 14, color: Colors.darkBlack }}>New to chitchat?</p>
                            <RaisedButton primary={true} label="Sign up now" onClick={this.onSignupPressed} style={{ margin: 8 }}> </RaisedButton>
                        </Flexbox>)
            :
                (<Flexbox justifyContent="center" alignItems="center">
                            <p style={{ fontFamily: "Roboto", fontSize: 14, color: Colors.darkBlack }}>Already have account?</p>
                            <RaisedButton primary={true} label="Sign in" onClick={this.onSigninPressed} style={{ margin: 8 }}> </RaisedButton>
                        </Flexbox>)}
            </Flexbox>);
    }
}
