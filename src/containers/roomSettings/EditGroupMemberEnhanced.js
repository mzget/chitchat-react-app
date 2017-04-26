"use strict";
const React = require("react");
const EditGroupMember_1 = require("./EditGroupMember");
const EditGroupMemberEnhancer_1 = require("./EditGroupMemberEnhancer");
exports.EditGroupMemberEnhanced = EditGroupMemberEnhancer_1.EditGroupMemberEnhancer(({ room_id, members, updateMembers, onToggleItem, onSubmit, onFinished }) => React.createElement(EditGroupMember_1.EditGroupMember, { members: members, onToggleItem: onToggleItem, onSubmit: onSubmit }));
