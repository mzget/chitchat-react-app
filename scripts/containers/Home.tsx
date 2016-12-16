import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";


import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';

interface IComponentNameProps {
    location: {
        query: {
            userId: string;
            agentId: string;
            roomId: string;
        }
    };
};

interface IComponentNameState { };

class Home extends React.Component<IComponentNameProps, any> {
    componentDidMount() {
        console.log(this.props);

        StalkBridgeActions.stalkLogin(this.props.location.query.agentId, "");

        if (this.props.location.query.roomId) {

        }
    }

    public render(): JSX.Element {
        return (<span>Body</span>);
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
    const creators = Map()
        .merge()
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

export default connect()(Home);
