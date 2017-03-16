"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Subheader_1 = require("material-ui/Subheader");
const GroupList_1 = require("./GroupList");
exports.OrgGroupListView = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Org-Group"),
    React.createElement(GroupList_1.GroupList, { values: props.orgGroups, onSelected: props.onselectGroup })));
