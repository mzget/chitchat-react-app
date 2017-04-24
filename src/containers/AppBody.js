"use strict";
const React = require("react");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const GroupDetailEnhancer_1 = require("./roomSettings/GroupDetailEnhancer");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
exports.AppBody = ({ match, onError, userReducer, chatroomReducer }) => (React.createElement("div", null, (match.params.filter == "user") ?
    React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError }) :
    (match.path.match("chatroom/chat")) ?
        React.createElement(Chat_1.ChatPage, { match: match, onError: onError }) :
        (match.path.match("/chatroom/settings")) ?
            React.createElement(GroupDetailEnhancer_1.GroupDetailEnhanced, { onError: onError, onFinished: () => console.log("Finished") }) : React.createElement(Post_1.Post, null)));
