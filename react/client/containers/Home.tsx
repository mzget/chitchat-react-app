import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from "immutable";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Flex, Box } from "reflexbox";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";

import * as chatlogsActions from "../redux/chatlogs/chatlogsActions";
import * as AuthRx from "../redux/authen/authRx";
import * as AppActions from "../redux/app/persistentDataActions";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import AuthenBox from "./authen/AuthenBox";

interface IComponentNameState {
    alert: boolean;
};

class Home extends React.Component<IComponentProps, IComponentNameState> {
    alertMessage: string = "";
    alertTitle: string = "";
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = null;
    subHeaderHeight = null;
    bodyHeight = null;
    footerHeight = null;

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

    componentWillMount() {
        console.log("Home", global.userAgent);

        this.state = {
            alert: false
        };
        this.closeAlert = this.closeAlert.bind(this);
        this.onAuthBoxError = this.onAuthBoxError.bind(this);

        this.props.dispatch(AppActions.getSession());
    }

    componentDidMount() {
        let toolbar = document.getElementById("toolbar");
        let warning_bar = document.getElementById("warning_bar");
        let app_body = document.getElementById("app_body");
        let app_footer = document.getElementById("app_footer");

        this.headerHeight = toolbar.clientHeight;
        this.subHeaderHeight = (warning_bar) ? warning_bar.clientHeight : 0;
        this.footerHeight = app_footer.clientHeight;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight));

        this.setState(previous => ({ ...previous }));
    }


    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } },
            chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer
        } = nextProps as IComponentProps;

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
            default:
                break;
        }
    }

    public render(): JSX.Element {
        let { location: { query: { userId, username, roomId, contactId } } } = this.props;

        return (
            <MuiThemeProvider>
                <div>
                    <div id={"toolbar"} style={{ height: this.headerHeight }} >
                        <SimpleToolbar title={"ChitChat team communication."} />
                        <Subheader>{null}</Subheader>
                    </div>
                    <div style={{ backgroundColor: Colors.indigo50 }}>
                        <div id={"app_body"} style={{ height: this.bodyHeight, backgroundColor: Colors.indigo50 }}>
                            <Flex flexColumn={true} >
                                <Flex align="center">
                                    <Box p={2} flexAuto></Box>
                                    <AuthenBox {...this.props}
                                        onError={this.onAuthBoxError} />
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
                        <div id={"app_footer"} style={{ width: this.clientWidth, fontSize: 16, padding: 2 }}>
                            <Flex px={2} align="center" justify="center">
                                <span>Powered by Stalk realtime messaging service.</span>
                            </Flex>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider >
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Home);
