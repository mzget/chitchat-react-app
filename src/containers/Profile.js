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
const Colors = require("material-ui/styles/colors");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
class Profile extends React.Component {
    constructor() {
        super(...arguments);
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = null;
        this.subHeaderHeight = null;
        this.bodyHeight = null;
    }
    componentWillMount() {
        this.state = {
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.headerHeight = document.getElementById("toolbar").clientHeight;
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, overflowX: "hidden", margin: 0, padding: 0, height: this.bodyHeight } },
                React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: this.props.userReducer.user, teamProfile: this.props.userReducer.teamProfile, alert: this.props.onError }))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
exports.ProfilePage = react_redux_1.connect(mapStateToProps)(Profile);
