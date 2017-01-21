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
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ChatLogsBox_1 = require("./ChatLogsBox");
const authRx = require("../redux/authen/authRx");
;
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.menus = ["admin", "log out"];
    }
    componentWillMount() {
        this.state = {
            toolbar: 'Home'
        };
        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { userReducer } = nextProps;
        switch (userReducer.state) {
            default:
                if (!userReducer.user) {
                    this.props.router.push('/');
                }
                break;
        }
    }
    onSelectMenuItem(id, value) {
        console.log(this.menus[id]);
        let { authReducer } = this.props;
        switch (id) {
            case 0:
                this.props.router.push(`/admin/${authReducer.user}`);
                break;
            case 1:
                this.props.dispatch(authRx.logout(this.props.authReducer.token));
                break;
            default:
                break;
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SimpleToolbar_1.default, { title: this.state.toolbar, menus: this.menus, onSelectedMenuItem: this.onSelectMenuItem }),
            React.createElement(ChatLogsBox_1.default, __assign({}, this.props))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Main);
