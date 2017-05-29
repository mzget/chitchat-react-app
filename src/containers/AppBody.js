"use strict";
var React = require("react");
var Chat_1 = require("./Chat");
var Post_1 = require("./Post");
var ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
var AddMembers_1 = require("./roomSettings/AddMembers");
var GroupDetailEnhancer_1 = require("./roomSettings/GroupDetailEnhancer");
var getview = function (props) {
    var match = props.match, history = props.history, onError = props.onError, userReducer = props.userReducer;
    if (match.params.filter == "user") {
        return React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError });
    }
    else if (match.path.match("chatroom")) {
        if (match.path.match("chatroom/chat")) {
            return React.createElement(Chat_1.ChatPage, { match: match, onError: onError, history: history });
        }
        else if (match.params.edit == "edit") {
            return React.createElement(GroupDetailEnhancer_1.GroupDetailEnhanced, { onError: onError, onFinished: function () { return console.log("Finished"); } });
        }
        else if (match.params.edit == "add_member") {
            return React.createElement(AddMembers_1.AddMembersEnhanced, { match: match });
        }
    }
    else {
        return React.createElement(Post_1.Post, null);
    }
};
exports.AppBody = function (props) { return (React.createElement("div", null,
    "   ",
    getview(props))); };
