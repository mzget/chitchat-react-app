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
import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as userActions from "../redux/user/userActions";
;
;
class Home extends React.Component {
    componentDidMount() {
        console.log("Home", this.props);
        let { location: { query: { userId, username, roomId, contactId } } } = this.props;
        if (username) {
            this.props.dispatch(userActions.fetchUser(username));
        }
        if (contactId) {
            this.props.dispatch(userActions.fetchContact(contactId));
        }
        StalkBridgeActions.getPrivateChatRoomId(this.props.location.query.agentId, "");
        if (this.props.location.query.roomId) {
        }
    }
    render() {
        return (React.createElement("span", null, "Welcome to stalk chat service."));
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
