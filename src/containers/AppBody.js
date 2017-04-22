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
const recompose_1 = require("recompose");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
const mapStateToProps = (state) => (__assign({}, state));
const enhance = recompose_1.compose(react_redux_1.connect(mapStateToProps));
exports.AppBody = enhance(({ match, userReducer, onError }) => (React.createElement("div", null, (match.params.filter == "user") ?
    React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError }) :
    (match.params.filter == "chat") ? React.createElement(Chat_1.ChatPage, null) : React.createElement(Post_1.Post, null))));
