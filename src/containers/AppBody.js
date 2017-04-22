"use strict";
const React = require("react");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
class AppBody extends React.Component {
    render() {
        let { match, userReducer, onError } = this.props;
        return (React.createElement("div", null, (match.params.filter == "user") ?
            React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError }) :
            (match.params.filter == "chat") ? React.createElement(Chat_1.ChatPage, null) : React.createElement(Post_1.Post, null)));
    }
}
exports.AppBody = AppBody;
