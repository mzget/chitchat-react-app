var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
/**
 * Redux + Immutable
 */
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
;
;
class Home extends React.Component {
    componentDidMount() {
        console.log(this.props);
        StalkBridgeActions.stalkLogin(this.props.location.query.agentId, "");
        if (this.props.location.query.roomId) {
        }
    }
    render() {
        return (React.createElement("span", null, "Body"));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
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
