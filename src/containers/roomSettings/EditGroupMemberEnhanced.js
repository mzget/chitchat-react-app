"use strict";
const React = require("react");
const EditGroupMember_1 = require("./EditGroupMember");
const EditGroupMemberEnhancer_1 = require("./EditGroupMemberEnhancer");
const Colors = require("material-ui/styles/colors");
const IconMenu_1 = require("material-ui/IconMenu");
const MenuItem_1 = require("material-ui/MenuItem");
const IconButton_1 = require("material-ui/IconButton");
const more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
const iconButtonElement = (React.createElement(IconButton_1.default, { touch: true, tooltip: "more" },
    React.createElement(more_vert_1.default, { color: Colors.grey400 })));
exports.EditGroupMemberEnhanced = EditGroupMemberEnhancer_1.EditGroupMemberEnhancer(({ members, value, removeItem }) => React.createElement(EditGroupMember_1.EditGroupMember, { members: members, rightIconButton: (item) => (React.createElement(IconMenu_1.default, { iconButtonElement: iconButtonElement, onChange: (e, itemValue) => {
            console.log("handleChange", itemValue);
            if (itemValue == "1") {
                removeItem(item);
            }
        }, value: value },
        React.createElement(MenuItem_1.default, { value: "1" }, "Delete"))) }));
