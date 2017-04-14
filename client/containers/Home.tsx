import * as React from "react";
/**
 * Redux + Immutable
 */
import * as immutable from "immutable";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Flex, Box } from "reflexbox";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";

import * as chatlogsActions from "../chitchat/chats/redux/chatlogs/chatlogsActions";
import * as AuthRx from "../redux/authen/authRx";
import * as AppActions from "../redux/app/persistentDataActions";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { AuthenBox } from "./authen/AuthenBox";

interface IComponentNameState {
    alert: boolean;
}

class Home extends React.Component<IComponentProps, IComponentNameState> {
    alertMessage: string = "";
    alertTitle: string = "";
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = 56;
    subHeaderHeight = null;
    bodyHeight = null;
    footerHeight = 24;

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () =>
            this.props.dispatch(AuthRx.clearError())
        );
    }

    onAuthBoxError(error: string) {
        this.alertTitle = "Authentication!";
        this.alertMessage = error;
        this.setState(prevState => ({ ...prevState, alert: true }));
    }

    constructor(props) {
        super(props);

        console.log("Home", global.userAgent);

        this.state = {
            alert: false
        };
        this.closeAlert = this.closeAlert.bind(this);
        this.onAuthBoxError = this.onAuthBoxError.bind(this);

        this.props.dispatch(AppActions.getSession());
    }

    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } },
            chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer
        } = nextProps as IComponentProps;

        let toolbar = document.getElementById("toolbar");
        let warning_bar = document.getElementById("warning_bar");
        let app_body = document.getElementById("app_body");
        let app_footer = document.getElementById("app_footer");

        this.subHeaderHeight = (warning_bar) ? warning_bar.clientHeight : 0;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight));

        let next = immutable.fromJS(authReducer);
        let prev = immutable.fromJS(this.props.authReducer);
        if (next && !next.equals(prev)) {
            switch (authReducer.state) {
                case AuthRx.AUTH_USER_SUCCESS: {
                    AppActions.saveSession();
                    this.props.router.push(`/team/${authReducer.user}`);
                    break;
                }
                case AuthRx.AUTH_USER_FAILURE: {
                    this.alertTitle = AuthRx.AUTH_USER_FAILURE;
                    this.alertMessage = authReducer.error;
                    this.setState(previous => ({ ...previous, alert: true }));
                    break;
                }
                case AuthRx.TOKEN_AUTH_USER_SUCCESS: {
                    this.props.router.push(`/team/${authReducer.user}`);
                    break;
                }
                case AppActions.GET_SESSION_TOKEN_SUCCESS: {
                    if (authReducer.state !== this.props.authReducer.state)
                        this.props.dispatch(AuthRx.tokenAuthUser(authReducer.token));
                    break;
                }
                case AuthRx.SIGN_UP_FAILURE: {
                    this.onAuthBoxError(authReducer.error);
                    break;
                }
                default:
                    break;
            }
        }
    }

    public render(): JSX.Element {
        let { location: { query: { userId, username, roomId, contactId } } } = this.props;

        return (
            <div style={{ overflow: "hidden" }}>
                <div id={"toolbar"} style={{ height: this.headerHeight }}>
                    <SimpleToolbar title={"ChitChat team communication."} />
                </div>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50, height: this.bodyHeight }}>
                    <Flex flexColumn={true} >
                        <Flex align="center">
                            <Box p={2} flexAuto></Box>
                            <AuthenBox {...this.props} onError={this.onAuthBoxError} />
                            <Box p={2} flexAuto></Box>
                        </Flex>
                        <Box flexAuto justify="flex-end"></Box>
                        <DialogBox
                            title={this.alertTitle}
                            message={this.alertMessage}
                            open={this.state.alert}
                            handleClose={this.closeAlert} />
                    </Flex>
                </div>
                <div id={"app_footer"} style={{
                    width: this.clientWidth, height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                }}>
                    <Flex px={2} align="center" justify="center">
                        <span>Powered by Stalk realtime messaging service.</span>
                    </Flex>
                </div>
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Home);
