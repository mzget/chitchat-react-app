import * as React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { Divider } from "material-ui";

import { IComponentProps } from "../utils/IComponentProps";

import * as AuthRx from "../redux/authen/authRx";
import * as AppActions from "../redux/app/persistentDataActions";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { AuthenBox } from "./authen/AuthenBox";
import { WithDialog } from "./toolsbox/DialogBoxEnhancer";
import { ChitChatFooter } from "../components/ChitChatFooter";

interface IComponentNameState {
    alert: boolean;
}

class Home extends React.Component<IComponentProps, IComponentNameState> {
    public alertTitle: string = "";
    public alertMessage: string = "";

    constructor(props) {
        super(props);

        console.log("Home", (global as any).userAgent);

        this.state = {
            alert: false,
        };

        this.props.dispatch(AppActions.getSession());

        this.onForgotAccount = this.onForgotAccount.bind(this);
    }

    public onForgotAccount() {
        this.props.history.push("/forgotaccount");
    }

    public componentWillReceiveProps(nextProps) {
        const { userReducer, authReducer, alertReducer,
        } = nextProps as IComponentProps;

        const toolbar = document.getElementById("toolbar");
        const warning_bar = document.getElementById("warning_bar");
        const app_body = document.getElementById("app_body");
        const app_footer = document.getElementById("app_footer");

        if (!shallowEqual(authReducer, this.props.authReducer)) {
            switch (authReducer.state) {
                case AuthRx.AUTH_USER_FAILURE: {
                    this.alertTitle = AuthRx.AUTH_USER_FAILURE;
                    this.alertMessage = authReducer.error;
                    this.setState((previous) => ({ ...previous, alert: true }));
                    break;
                }
                case AppActions.GET_SESSION_TOKEN_SUCCESS: {
                    if (authReducer.state !== this.props.authReducer.state) {
                        this.props.dispatch(AuthRx.tokenAuthUser(authReducer.token));
                    }
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

    public render(): JSX.Element {
        return (
            <Flexbox flexDirection="column" height="100vh" >
                <div id={"app_bar"}  >
                    <SimpleToolbar title={"ChitChat team communication."} />
                </div>
                <Flexbox flexDirection="column" height="100%" style={{ overflowY: "auto", backgroundColor: Colors.blueGrey50 }}>
                    <Flexbox flexDirection="row" flexGrow={1} style={{ overflowY: "auto" }}>
                        <Flexbox flexGrow={1} />
                        <Flexbox flexDirection="column" alignItems="center" height="100%">
                            <AuthenBox {...this.props} onError={this.props.onError} />
                            <br />
                            <Link to="/forgotaccount" >
                                <p style={{ fontFamily: "Roboto", fontSize: 14, color: Colors.lightBlue900 }}>Forgotten account</p>
                            </Link>
                            <br />
                        </Flexbox>
                        <Flexbox flexGrow={1} />
                    </Flexbox>
                    <Divider inset={true} />
                    <Flexbox element="footer" flexDirection="column" alignItems="center" >
                        <ChitChatFooter />
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export const HomeWithStore = connect(mapStateToProps)(Home) as React.ComponentClass<{ onError, history }>;

export const HomeWithDialogEnhance = WithDialog(withRouter<any>(HomeWithStore));
