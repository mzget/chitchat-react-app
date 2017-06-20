"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var react_redux_1 = require("react-redux");
var Colors = require("material-ui/styles/colors");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
var Profile = (function (_super) {
    __extends(Profile, _super);
    function Profile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clientWidth = document.documentElement.clientWidth;
        _this.clientHeight = document.documentElement.clientHeight;
        _this.headerHeight = null;
        _this.subHeaderHeight = null;
        _this.bodyHeight = null;
        return _this;
    }
    Profile.prototype.componentWillMount = function () {
        this.state = {
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.bodyHeight = this.clientHeight - this.headerHeight;
    };
    Profile.prototype.onBackPressed = function () {
        // Jump to main menu.
        this.props.history.goBack();
    };
    Profile.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, overflowX: "hidden", margin: 0, padding: 0, height: this.bodyHeight } },
                React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: this.props.userReducer.user, teamProfile: this.props.userReducer.teamProfile, alert: this.props.onError }))));
    };
    return Profile;
}(React.Component));
var mapStateToProps = function (state) { return (__assign({}, state)); };
exports.ProfilePage = react_redux_1.connect(mapStateToProps)(Profile);
