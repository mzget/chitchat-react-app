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
const teamRx = require("../../redux/team/teamRx");
;
class ChatListBox extends React.Component {
    componentWillMount() {
        console.log("ChatList", this.props);
        this.props.dispatch(teamRx.getTeamMembers(this.props.teamReducer.team._id));
    }
    render() {
        return (React.createElement("div", null));
    }
}
/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => (__assign({}, state));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(ChatListBox);
