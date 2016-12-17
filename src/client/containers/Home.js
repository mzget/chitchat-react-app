var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { connect } from "react-redux";
import * as authActions from "../redux/auth/authActions";
;
;
class Home extends React.Component {
    componentDidMount() {
        console.log("Home", this.props);
        this.props.dispatch(authActions.fetchUser("mzget"));
        // StalkBridgeActions.stalkLogin(this.props.location.query.agentId, "");
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
    return {
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
