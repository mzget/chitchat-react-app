import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import * as AuthRx from "../redux/authen/authRx";
import * as AppActions from "../redux/app/persistentDataActions";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { AuthenBox } from "./authen/AuthenBox";
class Home extends React.Component {
    onForgotAccount() {
        this.props.history.push("/forgotaccount");
    }
    componentWillMount() {
        console.log("Home", global["userAgent"]);
        this.state = {
            alert: false
        };
        this.props.dispatch(AppActions.getSession());
        this.onForgotAccount = this.onForgotAccount.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { userReducer, authReducer, alertReducer } = nextProps;
        let toolbar = document.getElementById("toolbar");
        let warning_bar = document.getElementById("warning_bar");
        let app_body = document.getElementById("app_body");
        let app_footer = document.getElementById("app_footer");
        if (!shallowEqual(authReducer, this.props.authReducer)) {
            switch (authReducer.state) {
                case AuthRx.AUTH_USER_FAILURE: {
                    this.alertTitle = AuthRx.AUTH_USER_FAILURE;
                    this.alertMessage = authReducer.error;
                    this.setState(previous => (Object.assign({}, previous, { alert: true })));
                    break;
                }
                case AppActions.GET_SESSION_TOKEN_SUCCESS: {
                    if (authReducer.state !== this.props.authReducer.state)
                        this.props.dispatch(AuthRx.tokenAuthUser(authReducer.token));
                    break;
                }
                default:
                    break;
            }
        }
        if (!shallowEqual(userReducer.user, this.props.userReducer.user)) {
            if (userReducer.user) {
                this.props.history.replace(`/teams`);
            }
        }
        if (alertReducer.error) {
            this.props.onError(alertReducer.error);
        }
    }
    render() {
        return (<div style={{ overflow: "hidden", height: "100vh" }}>
                <div id={"toolbar"}>
                    <SimpleToolbar title={"ChitChat team communication."}/>
                </div>
                <Flexbox flexDirection="column" style={{ overflow: "auto", height: "calc(100vh - 56px)", backgroundColor: Colors.blueGrey50 }}>
                    <Flexbox flexDirection="row">
                        <Flexbox flexGrow={1}/>
                        <Flexbox flexDirection="column" alignItems="center">
                            <AuthenBox {...this.props} onError={this.props.onError}/>
                            <a style={{ fontFamily: "Roboto", fontSize: 14, color: Colors.blue700 }} onClick={this.onForgotAccount}>Forgotten account</a>
                        </Flexbox>
                        <Flexbox flexGrow={1}/>
                    </Flexbox>
                    <Flexbox flexGrow={1}/>
                    <Flexbox element="footer" alignItems="center" justifyContent="center">
                        <p style={{ fontFamily: "Roboto", fontSize: 14 }}>Powered by S-Talk Communication API.</p>
                    </Flexbox>
                </Flexbox>
            </div>);
    }
}
const mapStateToProps = (state) => (Object.assign({}, state));
export const HomeWithStore = connect(mapStateToProps)(Home);
