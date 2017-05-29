"use strict";
var React = require("react");
var EditGroupMember_1 = require("./EditGroupMember");
var EditGroupMemberEnhancer_1 = require("./EditGroupMemberEnhancer");
var Colors = require("material-ui/styles/colors");
var IconMenu_1 = require("material-ui/IconMenu");
var MenuItem_1 = require("material-ui/MenuItem");
var IconButton_1 = require("material-ui/IconButton");
var more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
var iconButtonElement = (React.createElement(IconButton_1["default"], { touch: true, tooltip: "more" },
    React.createElement(more_vert_1["default"], { color: Colors.grey400 })));
exports.EditGroupMemberEnhanced = EditGroupMemberEnhancer_1.EditGroupMemberEnhancer(function (_a) {
    var members = _a.members, room_id = _a.room_id, value = _a.value, removeItem = _a.removeItem;
    return React.createElement(EditGroupMember_1.EditGroupMember, { members: members, rightIconButton: function (item) { return (React.createElement(IconMenu_1["default"], { iconButtonElement: iconButtonElement, onChange: function (e, itemValue) {
                if (itemValue == "1") {
                    removeItem(item);
                }
            }, value: value },
            React.createElement(MenuItem_1["default"], { value: "1" }, "Delete"))); } });
});
