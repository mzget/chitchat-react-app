import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import { Flex, Box } from "reflexbox";
import * as Colors from "material-ui/styles/colors";
import * as AuthRx from "../redux/authen/authRx";
import * as AppActions from "../redux/app/persistentDataActions";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { AuthenBox } from "./authen/AuthenBox";
class Home extends React.Component {
    constructor() {
        super(...arguments);
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = 56;
        this.subHeaderHeight = null;
        this.bodyHeight = null;
        this.footerHeight = 24;
    }
    onForgotAccount() {
        this.props.history.push("/forgotaccount");
    }
    componentWillMount() {
        console.log("Home", global.userAgent, this.props);
        this.state = {
            alert: false
        };
        this.headerHeight = 56;
        this.footerHeight = 24;
        this.clientHeight = document.documentElement.clientHeight;
        this.bodyHeight = (this.clientHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight));
        this.props.dispatch(AppActions.getSession());
        this.onForgotAccount = this.onForgotAccount.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { userReducer, authReducer, alertReducer } = nextProps;
        let toolbar = document.getElementById("toolbar");
        let warning_bar = document.getElementById("warning_bar");
        let app_body = document.getElementById("app_body");
        let app_footer = document.getElementById("app_footer");
        this.subHeaderHeight = (warning_bar) ? warning_bar.clientHeight : 0;
        if (!shallowEqual(authReducer, this.props.authReducer)) {
            switch (authReducer.state) {
                case AuthRx.AUTH_USER_SUCCESS: {
                    AppActions.saveSession();
                    break;
                }
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
                this.props.history.replace(`/team/${authReducer.user}`);
            }
        }
        if (alertReducer.error) {
            this.props.onError(alertReducer.error);
        }
    }
    render() {
        return (React.createElement("div", { style: { overflow: "hidden" } },
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight } },
                React.createElement(SimpleToolbar, { title: "ChitChat team communication." })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.blueGrey50, height: this.bodyHeight } },
                React.createElement(Flex, { flexColumn: true },
                    React.createElement(Flex, { align: "center" },
                        React.createElement(Box, { p: 2, flexAuto: true }),
                        React.createElement(AuthenBox, Object.assign({}, this.props, { onError: this.props.onError })),
                        React.createElement(Box, { p: 2, flexAuto: true })),
                    React.createElement(Flex, { align: "center" },
                        React.createElement(Box, { p: 2, flexAuto: true }),
                        React.createElement("a", { onClick: this.onForgotAccount }, "Forgotten account"),
                        React.createElement(Box, { p: 2, flexAuto: true })),
                    React.createElement(Box, { flexAuto: true, justify: "flex-end" }))),
            React.createElement("div", { id: "app_footer", style: {
                    width: this.clientWidth, height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.blueGrey50
                } },
                React.createElement(Flex, { px: 2, align: "center", justify: "center" },
                    React.createElement("span", null, "Powered by Stalk realtime communication API.")))));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (Object.assign({}, state));
export const HomeWithState = connect(mapStateToProps)(Home);
