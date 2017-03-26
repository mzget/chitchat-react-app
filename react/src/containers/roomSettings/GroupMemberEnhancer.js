"use strict";
const React = require("react");
const recompose_1 = require("recompose");
const GroupMember_1 = require("./GroupMember");
exports.GroupMemberEnhancer = recompose_1.pure(({ members }) => React.createElement(GroupMember_1.GroupMember, { members: members }));
