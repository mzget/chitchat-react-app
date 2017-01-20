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
const Toolbar_1 = require("../components/Toolbar");
const ChatLogsBox_1 = require("./ChatLogsBox");
;
;
class Main extends React.Component {
    componentWillMount() {
        this.state = {
            toolbar: 'Home'
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Toolbar_1.default, { title: this.state.toolbar }),
            React.createElement(ChatLogsBox_1.default, __assign({}, this.props))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(Main);
