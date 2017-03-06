"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const recompose_1 = require("recompose");
const MemberList_1 = require("../chatlist/MemberList");
const enhance = recompose_1.compose(recompose_1.withProps({}), recompose_1.flattenProp("members"));
exports.EditGroupMember = enhance(({ members }) => React.createElement(MemberList_1.MemberList, { onSelected: null, value: members, rightToggle: true, onToggleItem: (item, checked) => {
        console.log(item, checked);
    } }));
