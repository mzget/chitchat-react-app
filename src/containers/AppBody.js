"use strict";
const React = require("react");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
const GroupDetailEnhancer_1 = require("./roomSettings/GroupDetailEnhancer");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
const EditGroupMember_1 = require("./roomSettings/EditGroupMember");
const getview = (props) => {
    let { match, onError, userReducer, chatroomReducer, teamReducer } = props;
    console.log("APPBODY", match.params);
    if (match.params.filter == "user") {
        return React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: userReducer.user, teamProfile: userReducer.teamProfile, alert: onError });
    }
    else if (match.path.match("chatroom/chat")) {
        return React.createElement(Chat_1.ChatPage, { match: match, onError: onError });
    }
    else if (match.path.match("/chatroom/settings")) {
        if (match.params.edit == "edit") {
            return React.createElement(GroupDetailEnhancer_1.GroupDetailEnhanced, { onError: onError, onFinished: () => console.log("Finished") });
        }
        else if (match.params.edit == "add_member") {
            return React.createElement(EditGroupMember_1.EnhanceEditGroupMember, { match: match, teamMembers: teamReducer.members, room_id: match.params.room_id, onFinished: () => console.log("Finished") });
        }
    }
    else {
        return React.createElement(Post_1.Post, null);
    }
};
exports.AppBody = (props) => (React.createElement("div", null,
    "   ",
    getview(props)));
