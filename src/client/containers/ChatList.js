"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const userActions = require("../redux/user/userActions");
const ChatLogsBox_1 = require("./ChatLogsBox");
class IComponentNameProps {
}
;
;
class ChatList extends React.Component {
    componentWillMount() {
        console.log("ChatList", this.props);
        let { location: { query: { userId, username, roomId, contactId, agent_name } }, params } = this.props;
        if (params.filter) {
            this.props.dispatch(userActions.fetchUser(params.filter));
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(ChatLogsBox_1.default, __assign({}, this.props))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(ChatList);
