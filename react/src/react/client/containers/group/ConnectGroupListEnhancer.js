"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const GroupListView_1 = require("./GroupListView");
const GroupListEnhancer_1 = require("./GroupListEnhancer");
const bobo = GroupListEnhancer_1.GroupListEnhancer(({ groups, fetchGroup, onselectGroup, subHeader }) => React.createElement(GroupListView_1.GroupListView, { groups: groups, onselectGroup: onselectGroup, subHeader: subHeader }));
exports.ConnectGroupListEnhancer = react_redux_1.connect()(bobo);
