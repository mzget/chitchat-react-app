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

import UtilsBox from "./UtilsBox";
import AuthenBox from './authen/AuthenBox';

interface IComponentNameState {
};

class Home extends React.Component<IComponentProps, IComponentNameState> {
    componentWillMount() {
        console.log("Home", this.props);

        this.props.dispatch(AppActions.getSession());
    }

    componentDidMount() {

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
                <UtilsBox />
                <Flex px={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <p>Stalk realtime messaging service.</p>
                    <Box p={2} flexAuto></Box>
                </Flex>
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}

export default connect(mapStateToProps)(Home);
