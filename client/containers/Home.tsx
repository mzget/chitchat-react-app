import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";


import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as authActions from "../redux/auth/authActions";

interface IComponentNameProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    dispatch
};

interface IComponentNameState { };

class Home extends React.Component<IComponentNameProps, any> {
    componentDidMount() {
        console.log("Home", this.props);

        let { location: {query: {userId, username, roomId}} } = this.props;

        if (username)
            this.props.dispatch(authActions.fetchUser(username));
        // StalkBridgeActions.stalkLogin(this.props.location.query.agentId, "");

        if (this.props.location.query.roomId) {

        }
    }

    public render(): JSX.Element {
        return (<span>Welcome to stalk chat service.</span>);
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
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
