"use strict";
const React = require("react");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
const AddMembers_1 = require("./roomSettings/AddMembers");
const GroupDetailEnhancer_1 = require("./roomSettings/GroupDetailEnhancer");
const getview = (props) => {
    let { match, history, onError, userReducer } = props;
    if (match.params.filter == "user") {
        return React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError });
    }
    else if (match.path.match("chatroom")) {
        if (match.path.match("chatroom/chat")) {
            return React.createElement(Chat_1.ChatPage, { match: match, onError: onError, history: history });
        }
        else if (match.params.edit == "edit") {
            return React.createElement(GroupDetailEnhancer_1.GroupDetailEnhanced, { onError: onError, onFinished: () => console.log("Finished") });
        }
        else if (match.params.edit == "add_member") {
            return React.createElement(AddMembers_1.AddMembersEnhanced, { match: match });
        }
    }
    else {
        return React.createElement(Post_1.Post, null);
    }
};
exports.AppBody = (props) => (React.createElement("div", null,
    "   ",
    getview(props)));
