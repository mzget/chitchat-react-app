"use strict";
exports.__esModule = true;
var React = require("react");
var ContactBox_1 = require("./chatlist/ContactBox");
var ChatRoomOverview_1 = require("./ChatRoomOverview");
var getView = function (match, onError) {
    if (match.path.match("/chatroom/")) {
        return React.createElement(ChatRoomOverview_1.ChatRoomOverview, { match: match, onError: onError });
    }
    else {
        return React.createElement(ContactBox_1.ContactBox, null);
    }
};
exports.RightNav = function (_a) {
    var match = _a.match, onError = _a.onError;
    return (React.createElement("div", null, getView(match, onError)));
};
