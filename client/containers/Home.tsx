import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router';
import { Flex, Box } from 'reflexbox';

import { IComponentProps } from "../utils/IComponentProps";

import * as chatlogsActions from "../redux/chatlogs/chatlogsActions";
import * as AuthRx from '../redux/authen/authRx';
import * as AppActions from '../redux/app/persistentDataActions';

import { DialogBox } from "../components/DialogBox";
import AuthenBox from './authen/AuthenBox';

interface IComponentNameState {
    alert: boolean;
};

class Home extends React.Component<IComponentProps, IComponentNameState> {
    alertMessage: string = "";
    alertTitle: string = "";

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () =>
            this.props.dispatch(AuthRx.clearError())
        );
    }

    componentWillMount() {
        console.log("Home", global.userAgent);

        this.state = {
            alert: false
        };
        this.closeAlert = this.closeAlert.bind(this);

        this.props.dispatch(AppActions.getSession());
    }

    componentWillReceiveProps(nextProps) {
        let { location: {query: {userId, username, roomId, contactId}},
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
                if (authReducer.state != this.props.authReducer.state)
                    this.props.dispatch(AuthRx.tokenAuthUser(authReducer.token));
                break;
            }
            default:
                break;
        }
    }

    public render(): JSX.Element {
        let { location: {query: {userId, username, roomId, contactId}}, chatroomReducer, userReducer } = this.props;
        return (
            <div style={{ backgroundColor: '#EEEEEE', height: '100%' }}>
                <Flex align='center'>
                    <Box p={2} flexAuto></Box>
                    <AuthenBox {...this.props} />
                    <Box p={2} flexAuto></Box>
                </Flex>
                <Flex px={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <p>Stalk realtime messaging service.</p>
                    <Box p={2} flexAuto></Box>
                </Flex>
                <DialogBox title={this.alertTitle} message={this.alertMessage} open={this.state.alert} handleClose={this.closeAlert} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Home);
