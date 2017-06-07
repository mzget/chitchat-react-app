"use strict";
var React = require("react");
var ContactBox_1 = require("./chatlist/ContactBox");
var ChatRoomOverview_1 = require("./ChatRoomOverview");
var getView = function (match, onError) {
    if (match.path.match("/chatroom/")) {
        return <ChatRoomOverview_1.ChatRoomOverview match={match} onError={onError}/>;
    }
    else {
        return <ContactBox_1.ContactBox />;
    }
};
exports.RightNav = function (_a) {
    var match = _a.match, onError = _a.onError;
    return (<div>
        {getView(match, onError)}
    </div>);
};
