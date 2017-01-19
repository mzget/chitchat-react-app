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
const reflexbox_1 = require("reflexbox");
const AuthRx = require("../redux/authen/authRx");
const UtilsBox_1 = require("./UtilsBox");
const AuthenBox_1 = require("./authen/AuthenBox");
class IComponentNameProps {
}
;
;
class Home extends React.Component {
    componentWillMount() {
        console.log("Home", this.props);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, chatlogReducer, userReducer, stalkReducer, authReducer } = nextProps;
        switch (authReducer.state) {
            case AuthRx.AUTH_USER_SUCCESS: {
                this.props.router.push(`/chatlist/${authReducer.user}`);
            }
            default:
                break;
        }
    }
    render() {
        let { location: { query: { userId, username, roomId, contactId } }, chatroomReducer, userReducer } = this.props;
        return (React.createElement("div", { style: { backgroundColor: '#EEEEEE', height: '100%' } },
            React.createElement(reflexbox_1.Flex, { align: 'center' },
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                React.createElement(AuthenBox_1.default, __assign({}, this.props)),
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })),
            React.createElement(UtilsBox_1.default, null),
            React.createElement(reflexbox_1.Flex, { px: 2, align: 'center' },
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                React.createElement("p", null, "Stalk realtime messaging service."),
                React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Home);
